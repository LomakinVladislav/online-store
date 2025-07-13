# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.models.deck_model import deckModel
from db.models.card_model import cardModel
from db.schemas.deck_schemas import DeckWithCardsCreateSchema, DeckAddSchema


async def add_deck_with_cards(data: DeckWithCardsCreateSchema, session: Session, creator_user_id: int):
    # Обрабатываем обложку колоды
    deck_image = "https://foni.papik.pro/uploads/posts/2024-10/foni-papik-pro-rxs7-p-kartinki-slon-dlya-detei-na-prozrachnom-fo-1.png"
    if data.deck.image_url.strip():
        deck_image = data.deck.image_url
    
    # Создаем колоду
    new_deck = deckModel(
        creator_user_id=creator_user_id,
        title=data.deck.title,
        category=data.deck.category,
        description=data.deck.description,
        image_url=deck_image,
        is_public=data.deck.is_public,
        difficulty=data.deck.difficulty
    )
    
    session.add(new_deck)
    await session.flush()  # Получаем ID колоды без коммита
    
    # Создаем карточки
    for card_data in data.cards:
        new_card = cardModel(
            deck_id=new_deck.id,
            front_text=card_data.front_text,
            back_text=card_data.back_text,
            transcription=card_data.transcription,
            image_url=card_data.image_url
        )
        session.add(new_card)
    
    await session.commit()
    
    return {
        "ok": True,
        # "deck_id": new_deck.id,
        "cards_count": len(data.cards)
    }


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


async def get_my_decks(user_id: int, session: Session):
    query = select(deckModel).where(deckModel.creator_user_id == user_id)
    result = await session.execute(query)
    return result.scalars().all()