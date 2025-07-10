# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.models.deck_model import deckModel
from db.models.card_model import cardModel
from db.schemas.deck_schemas import DeckAddSchema

async def add_deck(data: DeckAddSchema, session: Session, creator_user_id):
    image_url= "https://foni.papik.pro/uploads/posts/2024-10/foni-papik-pro-rxs7-p-kartinki-slon-dlya-detei-na-prozrachnom-fo-1.png" if data.image_url=="" else data.image_url
    new_deck = deckModel(
        creator_user_id=creator_user_id,
        title=data.title,
        category=data.category,
        description=data.description,
        image_url=image_url,
        is_public=data.is_public,
        difficulty=data.difficulty
    )
    session.add(new_deck)
    await session.commit()
    return {"ok": True}


async def get_decks(session: Session):
    query = select(deckModel)
    result = await session.execute(query)
    return result.scalars().all()


async def get_deck_by_id(deck_id: int, session: Session):
    query = (select(cardModel).where(cardModel.deck_id == deck_id))
    result = await session.execute(query)
    return result.scalars().all()
