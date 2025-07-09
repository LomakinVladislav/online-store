from fastapi import APIRouter, HTTPException, status
from auth.schemas import UserInDBSchema
from fastapi import APIRouter, Depends
from auth.dependencies import get_current_active_user
from db.orm.deck_orm import add_deck, get_decks, get_deck_by_id
from db.schemas.deck_schemas import DeckAddSchema

from api.v1.common_route import SessionDep

router = APIRouter()


@router.post("/decks/")
async def add_deck_api(data: DeckAddSchema, session: SessionDep):
    result = await add_deck(data=data, session=session)
    return result


@router.get("/decks")
async def get_decks_api(session: SessionDep):
    result = await get_decks(session=session)
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