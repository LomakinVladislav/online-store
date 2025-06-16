from pydantic import BaseModel

class CardAddSchema(BaseModel):
    id: int
    deck_id: int
    front_text: str
    back_text: str

class CardSchema(CardAddSchema):
    id: int
