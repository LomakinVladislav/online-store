from pydantic import BaseModel
from typing import List
from db.schemas.card_shemas import CardCreateSchema, CardResponseSchema, CardUpdateSchema

class DeckAddSchema(BaseModel):
    title: str
    category: str
    description: str
    image_url: str
    is_public: bool
    difficulty: int


class DeckUpdateSchema(DeckAddSchema):
    pass


class DeckResponseSchema(DeckAddSchema):
    id: int


class DeckSchema(DeckResponseSchema):
    id: int
    creator_user_id: int
    created_at: str
    updated_at: str

# Схема для запроса на создание колоды
class DeckWithCardsCreateSchema(BaseModel):
    deck: DeckAddSchema
    cards: List[CardCreateSchema]

# Схема для запроса на получение данных о существующей колоде
class DeckWithCardsResponseSchema(BaseModel):
    deck: DeckResponseSchema
    cards: List[CardResponseSchema]


class DeckWithCardsUpdateSchema(BaseModel):
    deck: DeckUpdateSchema
    cards: List[CardUpdateSchema]
