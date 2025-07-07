from pydantic import BaseModel

class UserAddSchema(BaseModel):
    username: str
    email: str
    hashed_password: str
    full_name: str
    disabled: bool

class UserSchema(UserAddSchema):
    id: int
