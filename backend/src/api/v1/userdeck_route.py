from fastapi import APIRouter

from db.orm.userdeck_orm import add_userdeck
from db.schemas.userdeck_shemas import UserDeckAddSchema

from api.v1.common_route import SessionDep

router = APIRouter()


@router.post("/userdecks")
async def add_userdeck_api(data: UserDeckAddSchema, session: SessionDep):
    result = await add_userdeck(data=data, session=session)
    return result

