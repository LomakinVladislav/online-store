from pydantic import BaseModel

class DeckAddSchema(BaseModel):
    id: int
    creator_user_id: int
    title: str
    theme: str
    description: str
    image_url: str
    created_at: str
    updated_at: str
    is_public: bool
    difficulty: str

class DeckSchema(DeckAddSchema):
    id: int
