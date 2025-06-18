from datetime import datetime, timedelta, date

def compute_available_slots(doctor, appointment_date, db):
    now = datetime.now()
    start = datetime.combine(appointment_date, doctor.work_start)
    end = datetime.combine(appointment_date, doctor.work_end)

    all_slots = []
    current = start
    while current + timedelta(minutes=30) <= end:
        # ✅ If appointment_date is today, skip past time slots
        if appointment_date == date.today() and current < now:
            current += timedelta(minutes=30)
            continue
        all_slots.append(current.time().strftime("%H:%M"))
        current += timedelta(minutes=30)

    # Get booked slots
    from core.models.appointment import Appointment  # avoid circular import
    booked_appointments = db.query(Appointment).filter_by(
        specialist_id=doctor.id,
        date=appointment_date
    ).all()

    booked_times = {appt.start_time.strftime("%H:%M") for appt in booked_appointments}
    
    return [slot for slot in all_slots if slot not in booked_times]
