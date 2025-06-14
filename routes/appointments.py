from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.appointment import AppointmentInput
from core.database import SessionLocal
from core.models.appointment import Appointment

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/appointments/create")
def create_appointment(data: AppointmentInput, db: Session = Depends(get_db)):
    new_appointment = Appointment(
        patient_name=data.patient_name,
        age=data.age,
        symptoms=data.symptoms,
        specialist=data.specialist
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return {
        "message": "Appointment saved to database",
        "data": {
            "id": new_appointment.id,
            "patient_name": new_appointment.patient_name,
            "age": new_appointment.age,
            "symptoms": new_appointment.symptoms,
            "specialist": new_appointment.specialist
        }
    }
from fastapi import APIRouter, UploadFile, File
from utils.stt_processor import simulate_stt  # make sure path is correct
import shutil
import os
from utils.specialist_predictor import predict_specialist

@router.post("/appointments/voice")
async def create_appointment_from_voice(audio: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Save temp audio
    temp_path = f"temp_{audio.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    try:
        # 2. Extract symptoms from audio
        data = simulate_stt(temp_path)
        symptoms = data.get("symptoms", "")

        # 3. Predict specialist using model
        specialist, score = predict_specialist(symptoms)

        # 4. Create appointment object
        new_appointment = Appointment(
            patient_name=data.get("patient_name", "Unknown"),
            age=data.get("age", 0),
            symptoms=symptoms,
            specialist=specialist
        )

        db.add(new_appointment)
        db.commit()
        db.refresh(new_appointment)

        # 5. Return response
        return {
            "message": "Appointment created successfully from voice",
            "predicted_specialist": specialist,
            "similarity_score": round(score, 4),
            "appointment": {
                "id": new_appointment.id,
                "patient_name": new_appointment.patient_name,
                "age": new_appointment.age,
                "symptoms": symptoms,
                "specialist": specialist
            }
        }

    finally:
        # Clean up file
        os.remove(temp_path)