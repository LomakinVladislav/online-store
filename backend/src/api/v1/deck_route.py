from fastapi import APIRouter

from db.orm.deck_orm import add_deck
from db.schemas.deck_schemas import DeckAddSchema

from api.v1.common_route import SessionDep

router = APIRouter()


@router.post("/deck")
async def add_deck_api(data: DeckAddSchema, session: SessionDep):
    result = await add_deck(data=data, session=session)
    return result

