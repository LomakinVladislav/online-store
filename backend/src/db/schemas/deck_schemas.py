from pydantic import BaseModel
from typing import List
from db.schemas.card_schemas import CardCreateSchema, CardResponseSchema, CardUpdateSchema

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


class DeckWithCardsCreateSchema(BaseModel):
    deck: DeckAddSchema
    cards: List[CardCreateSchema]

class DeckWithCardsResponseSchema(BaseModel):
    deck: DeckResponseSchema
    cards: List[CardResponseSchema]


class DeckWithCardsUpdateSchema(BaseModel):
    deck: DeckUpdateSchema
    cards: List[CardUpdateSchema]
