from fastapi import APIRouter

from db.orm.card_orm import add_card
from db.schemas.card_shemas import CardAddSchema

from api.v1.common_route import SessionDep

router = APIRouter()


@router.post("/card")
async def add_card_api(data: CardAddSchema, session: SessionDep):
    result = await add_card(data=data, session=session)
    return result

