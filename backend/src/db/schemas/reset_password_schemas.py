from pydantic import BaseModel, EmailStr
from datetime import datetime

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ResetPasswordToken(BaseModel):
    id: int
    user_id: int
    reset_token: str
    reset_token_expires: datetime