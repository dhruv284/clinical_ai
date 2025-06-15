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
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password), # ⚠️ Should hash password before storing
        specialization=user.specialization
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully", "user_id": db_user.id}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not bcrypt.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Generate JWT token
    token = create_access_token(data={"sub": db_user.email})

    return {"access_token": token, "token_type": "bearer", "user_id": db_user.id, "name": db_user.full_name}
