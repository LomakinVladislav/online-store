from fastapi import APIRouter

from db.orm.card_orm import add_card, get_card
from db.schemas.card_schemas import CardAddSchema

from api.v1.common_route import SessionDep

router = APIRouter()


@router.post("/cards")
async def add_card_api(data: CardAddSchema, session: SessionDep):
    result = await add_card(data=data, session=session)
    return result


@router.get("/cards")
async def get_card_api(session: SessionDep):
    result = await get_card(session=session)
    return result

