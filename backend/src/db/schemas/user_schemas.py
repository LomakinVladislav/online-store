from pydantic import BaseModel

class UserAddSchema(BaseModel):
    id: int
    username: str
    email: str
    password: str

class UserSchema(UserAddSchema):
    id: int
