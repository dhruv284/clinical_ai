from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()
class AppointmentInput(BaseModel):
    patient_name: str
    age: int
    symptoms: str
    specialist: str

@router.post("/appointments/create")
async def create_appointment(data: AppointmentInput):
    print(f"Received appointment: {data}")
    return {"message": "Appointment created", "data": data}