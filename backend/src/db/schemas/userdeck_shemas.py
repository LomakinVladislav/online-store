from pydantic import BaseModel

class UserDeckAddSchema(BaseModel):
    id: int
    user_id: int
    deck_id: int
    added_at: str
    progress: float

class UserDeckSchema(UserDeckAddSchema):
    id: int
