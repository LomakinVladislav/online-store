# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session
from sqlalchemy import select

from src.db.models.deck_model import deckModel
from src.db.schemas.deck_schemas import DeckAddSchema

async def add_deck(data: DeckAddSchema, session: Session):
    new_deck = deckModel(
        id=data.id,
        creator_user_id=data.creator_user_id,
        title=data.title,
        theme=data.theme,
        description=data.description,
        image_url=data.image_url,
        created_at=data.created_at,  # Можно генерировать автоматически (datetime.now())
        updated_at=data.updated_at,
        is_public=data.is_public,
        difficulty=data.difficulty
    )
    session.add(new_deck)
    await session.commit()
    return {"ok": True}


async def get_deck(session: Session):
    query = select(deckModel)
    result = await session.execute(query)
    return result.scalars().all()