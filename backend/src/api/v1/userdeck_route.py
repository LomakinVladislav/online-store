from fastapi import APIRouter

from src.db.orm.userdeck_orm import add_userdeck
from src.db.schemas.userdeck_shemas import UserDeckAddSchema

from src.api.v1.common_route import SessionDep

router = APIRouter()


@router.post("/userdeck")
async def add_userdeck_api(data: UserDeckAddSchema, session: SessionDep):
    result = await add_userdeck(data=data, session=session)
    return result

