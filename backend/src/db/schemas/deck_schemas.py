from pydantic import BaseModel
from typing import List
from db.schemas.card_shemas import CardCreateSchema

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

# Схема для всего запроса на создание колоды
class DeckWithCardsCreateSchema(BaseModel):
    deck: DeckAddSchema
    cards: List[CardCreateSchema]
