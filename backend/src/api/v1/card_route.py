from fastapi import APIRouter

from src.db.orm.card_orm import add_card, get_card
from src.db.schemas.card_shemas import CardAddSchema

from src.api.v1.common_route import SessionDep

router = APIRouter()


@router.post("/card")
async def add_card_api(data: CardAddSchema, session: SessionDep):
    result = await add_card(data=data, session=session)
    return result


@router.get("/card")
async def get_card_api(session: SessionDep):
    result = await get_card(session=session)
    return result

