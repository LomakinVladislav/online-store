from pydantic import BaseModel

class UserAddSchema(BaseModel):
    username: str
    email: str
    password: str
    full_name: str

class UserSchema(UserAddSchema):
    id: int
    disabled: bool
