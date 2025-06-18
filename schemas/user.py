from pydantic import BaseModel

from pydantic import BaseModel
from datetime import time
from typing import Optional

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    specialization: str
    work_start: Optional[time] = None
    work_end: Optional[time] = None


class UserLogin(BaseModel):
    email: str
    password: str
