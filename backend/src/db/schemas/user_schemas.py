from pydantic import BaseModel

class UserAddSchema(BaseModel):
    username: str
    email: str
    password: str
    full_name: str

class UserInDBSchema(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
    id: int
    hashed_password: str