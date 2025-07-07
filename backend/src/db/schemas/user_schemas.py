from pydantic import BaseModel

class UserAddSchema(BaseModel):
    username: str
    email: str
    password: str

class UserSchema(UserAddSchema):
    id: int
