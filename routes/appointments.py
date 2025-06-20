from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from core.database import SessionLocal
from core.models.appointment import Appointment
from core.models.user import User
from utils.stt_processor import simulate_stt
from utils.specialist_predictor import predict_specialist
from datetime import datetime, timedelta
import shutil
import os

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
from sqlalchemy import func
from datetime import datetime, timedelta
from sqlalchemy import func
from core.models.user import User
from core.models.appointment import Appointment

def round_up_to_next_slot(dt, slot_minutes=30):
    """Round datetime up to next 30-min aligned slot"""
    discard = timedelta(minutes=dt.minute % slot_minutes,
                        seconds=dt.second,
                        microseconds=dt.microsecond)
    dt += timedelta(minutes=slot_minutes) - discard if discard.total_seconds() > 0 else timedelta()
    return dt.replace(second=0, microsecond=0)

def find_doctor_and_slot_today(specialization, duration_minutes, db):
    today = datetime.today().date()
    now = datetime.now()
    aligned_now = round_up_to_next_slot(now)

    doctors = db.query(User).filter(
        func.lower(User.role) == 'specialist',
        func.lower(User.specialization) == specialization.lower()
    ).all()

    for doc in doctors:
        start = datetime.combine(today, doc.work_start)
        end = datetime.combine(today, doc.work_end)

        if aligned_now > end:
            continue

        current = max(start, aligned_now)

        # Get all today's appointments for this doctor
        appointments = db.query(Appointment).filter_by(
            specialist_id=doc.id,
            date=today
        ).order_by(Appointment.start_time).all()

        for appt in appointments:
            appt_start = datetime.combine(today, appt.start_time)
            appt_end = datetime.combine(today, appt.end_time)

            # Check for free gap before this appointment
            if (appt_start - current).total_seconds() >= duration_minutes * 60:
                return doc, current.time()

            current = max(current, appt_end)
            current = round_up_to_next_slot(current)

        # Check if there's free time after last appointment
        if (end - current).total_seconds() >= duration_minutes * 60:
            return doc, current.time()

    return None, None

@router.post("/appointments/voice")
async def create_appointment_from_voice(audio: UploadFile = File(...), db: Session = Depends(get_db)):
    temp_path = f"temp_{audio.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    try:
        data = simulate_stt(temp_path)
        symptoms = data.get("symptoms", "")
        patient_name = data.get("patient_name", "Unknown")
        age = data.get("age", 0)

        specialist, score = predict_specialist(symptoms)
        print(specialist)
        doctor_exists = db.query(User).filter(
            func.lower(User.role) == 'specialist',
            func.lower(User.specialization) == specialist.lower()
        ).first()

        if not doctor_exists:
            return {
                "message": f"Doctor specialization '{specialist}' is not registered. Please try different symptoms or contact admin."
            }
        # Auto-book today only
        doc, slot = find_doctor_and_slot_today(specialist, 30, db)
        print(doc,slot)
        if not doc or not slot:
            return {
                "message": f"No available slots today for {specialist}. Please try later or choose another day."
            }

        # Create appointment with time and doctor
        today = datetime.today().date()
        start_time = slot
        end_time = (datetime.combine(today, slot) + timedelta(minutes=30)).time()

        new_appointment = Appointment(
            patient_name=patient_name,
            age=age,
            symptoms=symptoms,
            specialist=specialist,
            specialist_id=doc.id,
            date=today,
            start_time=start_time,
            end_time=end_time,
            status="confirmed"
        )

        db.add(new_appointment)
        db.commit()
        db.refresh(new_appointment)

        return {
            "message": "Appointment booked successfully from voice",
            "predicted_specialist": specialist,
            "similarity_score": round(score, 4),
            "appointment": {
                "id": new_appointment.id,
                "patient_name": patient_name,
                "age": age,
                "symptoms": symptoms,
                "specialist": specialist,
                "doctor": doc.full_name,
                "date": str(today),
                "time": start_time.strftime('%I:%M %p')
            }
        }

    finally:
        os.remove(temp_path)

from schemas.appointment import AppointmentManual

@router.post("/appointments/create")
async def create_appointment(data: AppointmentManual, db: Session = Depends(get_db)):
    # If specialist/doctor is NOT given, predict from symptoms
    if not data.specialist or not data.specialist_id:
        predicted_specialist, score = predict_specialist(data.symptoms)
        data.specialist = predicted_specialist

        doc, slot = find_doctor_and_slot_today(predicted_specialist, 30, db)
        if not doc or not slot:
            raise HTTPException(
                status_code=409,
                detail=f"No available doctors for {predicted_specialist} at this time."
            )

        specialist_id = doc.id
    else:
        # use provided doctor/specialist
        doc = db.query(User).filter_by(id=data.specialist_id, role="specialist").first()
        if not doc:
            raise HTTPException(status_code=404, detail="Specialist not found")
        
        # Check for available slot
        doc, slot = find_doctor_and_slot_today(doc.specialization, 30, db)
        if not doc or not slot:
            raise HTTPException(
                status_code=409,
                detail=f"No available slots for Dr. {doc.full_name} at this time."
            )

        specialist_id = doc.id

    # Compute slot
    today = datetime.today().date()
    start_time = slot
    end_time = (datetime.combine(today, slot) + timedelta(minutes=30)).time()

    new_appointment = Appointment(
        patient_name=data.patient_name,
        age=data.age,
        symptoms=data.symptoms,
        specialist=data.specialist,
        specialist_id=specialist_id,
        date=today,
        start_time=start_time,
        end_time=end_time,
        status="confirmed"
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return {
        "message": "Appointment booked successfully",
        "appointment": {
            "id": new_appointment.id,
            "patient_name": new_appointment.patient_name,
            "age": new_appointment.age,
            "symptoms": new_appointment.symptoms,
            "specialist": new_appointment.specialist,
            "doctor": doc.full_name,
            "date": str(today),
            "time": start_time.strftime('%I:%M %p')
        }
    }
    
from fastapi import Query
from datetime import datetime, date as date_type
from utils.slot_utils import compute_available_slots
@router.get("/doctors/{doctor_id}/slots")
def get_available_slots(
    doctor_id: int,
    date: str = Query(...),
    db: Session = Depends(get_db)):
    doctor = db.query(User).filter_by(id=doctor_id, role='specialist').first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    try:
        appointment_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

    slots = compute_available_slots(doctor, appointment_date, db)
    return {"available_slots": slots}

from schemas.appointment import AppointmentAuto
from sqlalchemy import func
@router.post("/appointments/auto")
def create_auto_appointment(data: AppointmentAuto, db: Session = Depends(get_db)):
    # Step 1: Predict specialist
    print(data.dict())
    predicted = predict_specialist(data.symptoms)
    specialization = predicted[0] if isinstance(predicted, tuple) else predicted
    # Step 2: Fetch all doctors for predicted specialization
    
    doctors = db.query(User).filter(func.lower(User.specialization) == specialization.strip().lower()).all()
    if not doctors:
        raise HTTPException(
        status_code=404,
        detail=f"Doctor specialization '{specialization}' is not registered. Please try again later or choose another category.")
    # Step 3: Check slots for each doctor
    today = datetime.now().date()
    for doctor in doctors:
        for offset in range(0, 7):  # check next 7 days
            check_date = today + timedelta(days=offset)
            
            slots = compute_available_slots(doctor, check_date, db)
            print(slots)
            if slots:
                # Step 4: Pick earliest available slot
                print(slots)
                start_time = datetime.strptime(slots[0], "%H:%M").time()
                end_time = (datetime.combine(date_type.today(), start_time) + timedelta(minutes=30)).time()

                # Step 5: Book appointment
                appointment = Appointment(
                    patient_name=data.patient_name,
                    age=data.age,
                    symptoms=data.symptoms,
                    specialist=specialization,
                    specialist_id=doctor.id,
                    date=check_date,
                    start_time=start_time,
                    end_time=end_time,
                    status="confirmed"
                )
                db.add(appointment)
                db.commit()
                db.refresh(appointment)
                return {"message": "Appointment booked", "appointment": appointment}

    raise HTTPException(status_code=404, detail="No slots available in next 7 days")


@router.get("/appointments/all")
def get_all_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()
    result = []
    for appt in appointments:
        result.append({
            "id": appt.id,
            "patient_name": appt.patient_name,
            "age": appt.age,
            "symptoms": appt.symptoms,
            "specialist": appt.specialist,
            "doctor": appt.doctor.full_name if appt.doctor else "N/A",
            "date": str(appt.date),
            "time": appt.start_time.strftime('%I:%M %p') if appt.start_time else "N/A",
            "status": appt.status,
        })
    return result


@router.put("/appointments/{appointment_id}/status")
def update_appointment_status(appointment_id: int, status: str, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = status
    db.commit()
    db.refresh(appointment)
    return {"message": "Status updated", "appointment": appointment}

@router.get("/appointments/doctor/{doctor_id}")
def get_appointments_for_doctor(doctor_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.specialist_id == doctor_id).all()
    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found for this doctor")
    return appointments