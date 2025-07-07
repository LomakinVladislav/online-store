# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.models.card_model import cardModel
from db.schemas.card_shemas import CardAddSchema, CardSchema

async def add_card(data: CardAddSchema, session: Session):
    new_card = cardModel( 
        deck_id=data.deck_id,
        front_text=data.front_text,
        back_text=data.back_text,
        transcription=data.transcription,
        image_url=data.image_url,
    )
    session.add(new_card)
    await session.commit()
    return {"ok": True}


async def get_card(session: Session):
    query = select(cardModel)
    result = await session.execute(query)
    return result.scalars().all()