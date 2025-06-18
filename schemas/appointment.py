from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class AppointmentManual(BaseModel):
    patient_name: str
    age: int
    symptoms: str
    specialist: str
    specialist_id: int
    date: date
    start_time: time
    end_time: Optional[time] = None
    status: Optional[str] = "pending"

class AppointmentAuto(BaseModel):
    patient_name: str
    age: int
    symptoms: str

