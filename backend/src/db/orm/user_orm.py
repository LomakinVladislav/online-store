# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session
from db.models.user_model import userModel
from db.schemas.user_schemas import UserAddSchema
from auth.utils import get_password_hash


async def add_user(data: UserAddSchema, session: Session):
    new_user = userModel(
        username = data.username,
        email = data.email,
        hashed_password=get_password_hash(data.password),
        full_name = data.full_name,
        disabled = True
    )
    session.add(new_user)
    await session.commit()
    return {"ok": True}
