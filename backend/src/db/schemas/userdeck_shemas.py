from pydantic import BaseModel

class UserDeckAddSchema(BaseModel):
    user_id: int
    deck_id: int
    added_at: str
    progress: float

class UserDeckSchema(UserDeckAddSchema):
    id: int
