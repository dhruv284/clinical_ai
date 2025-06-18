from sqlalchemy import Column, Integer, String, Time
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)

    role = Column(String, nullable=False, default="specialist")  # Only "specialist"

    # 🔽 Required fields for specialists
    specialization = Column(String, nullable=False)
    work_start = Column(Time, nullable=False)
    work_end = Column(Time, nullable=False)

    # 🔁 Appointments assigned to this specialist
    appointments = relationship("Appointment", back_populates="doctor")
