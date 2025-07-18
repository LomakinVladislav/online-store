from pydantic import BaseModel


class CardCreateSchema(BaseModel):
    front_text: str
    back_text: str
    transcription: str
    image_url: str


class CardResponseSchema(CardCreateSchema):
    id: int


class CardUpdateSchema(CardResponseSchema):
    pass