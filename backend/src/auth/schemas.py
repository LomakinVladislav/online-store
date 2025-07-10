from pydantic import BaseModel

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class TokenDataSchema(BaseModel):
    username: str | None = None

class UserSchema(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDBSchema(UserSchema):
    id: int
    hashed_password: str