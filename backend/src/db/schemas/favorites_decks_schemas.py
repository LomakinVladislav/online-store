from pydantic import BaseModel
from typing import List

class FavoritesDecksAddSchema(BaseModel):
    user_id: int
    deck_id: int

class FavoritesDecksSchema(FavoritesDecksAddSchema):
    id: int
