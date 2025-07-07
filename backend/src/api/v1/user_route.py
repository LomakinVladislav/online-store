from fastapi import APIRouter
from db.orm.user_orm import add_user
from db.schemas.user_schemas import UserAddSchema
from fastapi import APIRouter, Depends
from auth.schemas import UserSchema, UserInDBSchema
from auth.dependencies import get_current_active_user
from api.v1.common_route import SessionDep


router = APIRouter()

@router.post("/users")
async def add_user_api(data: UserAddSchema, session: SessionDep):
    result = await add_user(data=data, session=session)
    return result


@router.get("/users/me/", response_model=UserSchema)
async def read_users_me(
    current_user: UserInDBSchema = Depends(get_current_active_user)
):
    return current_user

@router.get("/users/me/items/")
async def read_own_items(
    current_user: UserInDBSchema = Depends(get_current_active_user)
):
    return [{"item_id": "Foo", "owner": current_user.username}]