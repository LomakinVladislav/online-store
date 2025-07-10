from pydantic import BaseModel

class DeckAddSchema(BaseModel):
    title: str
    category: str
    description: str
    image_url: str
    is_public: bool
    difficulty: int

class DeckSchema(DeckAddSchema):
    id: int
    creator_user_id: int
    created_at: str
    updated_at: str
