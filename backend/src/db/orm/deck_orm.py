# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, select
from db.models.deck_model import deckModel
from db.models.card_model import cardModel
from db.schemas.deck_schemas import DeckWithCardsCreateSchema, DeckWithCardsUpdateSchema, DeckWithCardsResponseSchema, DeckResponseSchema, DeckAddSchema
from db.schemas.card_shemas import CardResponseSchema


async def add_deck_with_cards(data: DeckWithCardsCreateSchema, session: Session, creator_user_id: int):
    deck_image = "https://foni.papik.pro/uploads/posts/2024-10/foni-papik-pro-rxs7-p-kartinki-slon-dlya-detei-na-prozrachnom-fo-1.png"
    if data.deck.image_url.strip():
        deck_image = data.deck.image_url
    
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
    await session.flush()
    
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
        "cards_count": len(data.cards)
    }


async def get_deck_information_by_id(deck_id: int, creator_user_id: int, session: Session) -> DeckWithCardsResponseSchema:
    """
    Возвращает колоду и связанные карточки в формате DeckWithCardsCreateSchema
    для использования при редактировании колоды
    """
    deck_query = await session.execute(
        select(deckModel).where(
            (deckModel.id == deck_id) &
            (deckModel.creator_user_id == creator_user_id)
        )
    )
    deck = deck_query.scalar_one_or_none()
    
    if not deck:
        return None
    
    cards_query = await session.execute(
        select(cardModel).where(cardModel.deck_id == deck_id)
    )
    cards = cards_query.scalars().all()
    
    return DeckWithCardsResponseSchema(
        deck=DeckResponseSchema(
            id=deck.id,
            title=deck.title,
            category=deck.category,
            description=deck.description,
            image_url=deck.image_url,
            is_public=deck.is_public,
            difficulty=deck.difficulty
        ),
        cards=[
            CardResponseSchema(
                id=card.id,
                front_text=card.front_text,
                back_text=card.back_text,
                transcription=card.transcription,
                image_url=card.image_url
            )
            for card in cards
        ]
    )


async def update_deck_with_cards(deck_id: int, data: DeckWithCardsUpdateSchema, session: Session, creator_user_id: int
) -> int:
    deck_query = await session.execute(
        select(deckModel).where(
            (deckModel.id == deck_id) &
            (deckModel.creator_user_id == creator_user_id)
        ))
    deck = deck_query.scalar_one_or_none()
    if not deck:
        return None
    
    deck.title = data.deck.title
    deck.category = data.deck.category
    deck.description = data.deck.description
    deck.image_url = data.deck.image_url or "https://foni.papik.pro/uploads/posts/2024-10/foni-papik-pro-rxs7-p-kartinki-slon-dlya-detei-na-prozrachnom-fo-1.png"
    deck.is_public = data.deck.is_public
    deck.difficulty = data.deck.difficulty
    
    cards_query = await session.execute(
        select(cardModel).where(cardModel.deck_id == deck_id))
    existing_cards = cards_query.scalars().all()
    existing_card_ids = {card.id for card in existing_cards}
    
    updated_card_ids = set()
    cards_to_add = []
    
    for card_data in data.cards:
        if card_data.id > 0 and card_data.id in existing_card_ids:
            card = next(c for c in existing_cards if c.id == card_data.id)
            card.front_text = card_data.front_text
            card.back_text = card_data.back_text
            card.transcription = card_data.transcription
            card.image_url = card_data.image_url
            updated_card_ids.add(card_data.id)
        elif card_data.id <= 0: 
            new_card = cardModel(
                deck_id=deck_id,
                front_text=card_data.front_text,
                back_text=card_data.back_text,
                transcription=card_data.transcription,
                image_url=card_data.image_url
            )
            cards_to_add.append(new_card)
    
    cards_to_remove = [card for card in existing_cards if card.id not in updated_card_ids]
    for card in cards_to_remove:
        await session.delete(card)
    
    session.add_all(cards_to_add)
    
    await session.commit()
    return len(data.cards)



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
    query = select(deckModel).where(deckModel.is_public == True)
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


async def get_search_decks(query: str, session: Session):
    if not query.strip():
        return []
    
    search_pattern = f"%{query}%"
    
    stmt = select(deckModel).where(
        or_(
            deckModel.title.ilike(search_pattern),
            deckModel.description.ilike(search_pattern),
            deckModel.category.ilike(search_pattern)
        )
    )
    
    result = await session.execute(stmt)
    return result.scalars().all()
