from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from core.database import SessionLocal
from core.models.user import User
from schemas.user import UserCreate,UserLogin
from utils.security import hash_password
from utils.auth import create_access_token  # adjust based on your folder structure

from passlib.hash import bcrypt
router = APIRouter(
    prefix="/users",  # ✅ important for proper routing like /users/signup
    tags=["Users"]
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
print("✅ users.router loaded")
@router.post("/signup")
def signup_user(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter_by(email=data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=data.full_name,
        email=data.email,
        password=hash_password(data.password),
        role="specialist",  # hardcoded if it's only for specialists
        specialization=data.specialization,
        work_start=data.work_start,
        work_end=data.work_end
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not bcrypt.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "full_name": db_user.full_name,
            "role": db_user.role  # include if you have a role field
        }
    }

@router.get("/specialists")
def get_specialists(db: Session = Depends(get_db)):
    specialists = db.query(User).filter_by(role="specialist").all()
    return [
        {
            "id": sp.id,
            "full_name": sp.full_name,
            "specialization": sp.specialization,
        }
        for sp in specialists
    ]