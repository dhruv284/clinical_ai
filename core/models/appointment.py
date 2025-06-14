from sqlalchemy import Column, Integer, String
from core.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    symptoms = Column(String, nullable=False)
    specialist = Column(String, nullable=False)
