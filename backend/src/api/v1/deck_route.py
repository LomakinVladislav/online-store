from typing import List
from fastapi import APIRouter, HTTPException, status
from auth.schemas import UserInDBSchema
from fastapi import APIRouter, Depends
from auth.dependencies import get_current_active_user
from db.orm.deck_orm import add_deck_with_cards, get_decks, get_deck_by_id, get_my_decks, get_search_decks
from db.orm.favorites_decks_orm import add_favorite_deck, delete_favorite_deck, get_favorite_decks
from db.schemas.deck_schemas import DeckWithCardsCreateSchema
from db.schemas.favorites_decks_schemas import FavoritesDecksSchema
from api.v1.common_route import SessionDep

router = APIRouter()


@router.get("/decks")
async def get_decks_api(session: SessionDep):
    result = await get_decks(session=session)
    return result


@router.post("/decks/")
async def add_deck_api(
    data: DeckWithCardsCreateSchema, 
    session: SessionDep, 
    current_user: UserInDBSchema = Depends(get_current_active_user)
    )  -> List[FavoritesDecksSchema] :
    creator_user_id = current_user.id 
    result = await add_deck_with_cards(data=data, session=session, creator_user_id=creator_user_id)
    return result


@router.get("/decks/favorites/", response_model=List[int])
async def get_favorite_deck_api(session: SessionDep, current_user: UserInDBSchema = Depends(get_current_active_user)):
    user_id = current_user.id 
    result = await get_favorite_decks(session=session, user_id=user_id)
    return result


@router.post("/decks/favorites/{deck_id}")
async def add_favorite_deck_api(deck_id: int, session: SessionDep, current_user: UserInDBSchema = Depends(get_current_active_user)):
    user_id = current_user.id 
    result = await add_favorite_deck(deck_id=deck_id, session=session, user_id=user_id)
    return result


@router.delete("/decks/favorites/{deck_id}")
async def delete_favorite_deck_api(deck_id: int, session: SessionDep, current_user: UserInDBSchema = Depends(get_current_active_user)):
    user_id = current_user.id 
    result = await delete_favorite_deck(deck_id=deck_id, session=session, user_id=user_id)
    return result


@router.get("/decks/{deck_id}/cards")
async def get_deck_by_id_api(deck_id: int, session: SessionDep, current_user: UserInDBSchema = Depends(get_current_active_user)):
    result = await get_deck_by_id(deck_id=deck_id, session=session)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck not found"
        )
    return result


@router.get("/decks/my_decks/")
async def get_my_decks_api(session: SessionDep, current_user: UserInDBSchema = Depends(get_current_active_user)):
    user_id = current_user.id 
    result = await get_my_decks(user_id=user_id, session=session)
    return result


@router.get("/decks/search/")
async def get_search_decks_api(query: str, session: SessionDep):
    result = await get_search_decks(query=query, session=session)
    return result