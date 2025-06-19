from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine,Base
from core.models.appointment import Appointment
from core.models.user import User
from routes import appointments, users

# Create FastAPI app first
app = FastAPI()
@app.get("/")
def health_check():
    return {"message": "🚀 API is up and running!"}
# ✅ Enable CORS BEFORE including any routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
# Create tables
Appointment.__table__.create(bind=engine, checkfirst=True)
User.__table__.create(bind=engine, checkfirst=True)

# Register routers
app.include_router(appointments.router)
app.include_router(users.router)
