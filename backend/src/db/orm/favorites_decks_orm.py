from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models.favorites_decks_model import favoritesDecksModel


async def add_favorite_deck(deck_id: int, user_id: int, session: Session):
    existing_favorite_deck = await session.execute(
        select(favoritesDecksModel).where(favoritesDecksModel.user_id == user_id, favoritesDecksModel.deck_id == deck_id)
    )
    existing_favorite_deck = existing_favorite_deck.first()
    
    if existing_favorite_deck:
        return {"ok": False, "message": "Эта колода уже добавлена в избранное для данного пользователя"}
    new_favoite_deck = favoritesDecksModel(
        user_id=user_id,
        deck_id=deck_id,        
    )
    session.add(new_favoite_deck)
    await session.commit()  
    return {"ok": True}


async def delete_favorite_deck(deck_id: int, user_id: int, session: Session):
    query = select(favoritesDecksModel).where(favoritesDecksModel.deck_id == deck_id).where(favoritesDecksModel.user_id == user_id)
    result = await session.execute(query)
    favorite_deck_to_delete = result.scalars().first()

    if not favorite_deck_to_delete:
        return {"ok": False, "error": "Favorite deck not found"}

    await session.delete(favorite_deck_to_delete)
    await session.commit()
    return {"ok": True}


async def get_favorite_decks(user_id: int, session: Session):
    query = select(favoritesDecksModel.deck_id).where(favoritesDecksModel.user_id == user_id)
    result = await session.execute(query)
    return result.scalars().all()