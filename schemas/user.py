from pydantic import BaseModel

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    specialization: str



class UserLogin(BaseModel):
    email: str
    password: str
