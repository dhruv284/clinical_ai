from fastapi import FastAPI
from core.database import engine
from core.models.appointment import Appointment
from routes import appointments

# Create tables
Appointment.__table__.create(bind=engine, checkfirst=True)

app = FastAPI()

app.include_router(appointments.router)
