# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session

from db.models.user_model import userModel
from db.schemas.user_schemas import UserAddSchema

async def add_user(data: UserAddSchema, session: Session):
    new_user = userModel(
        username = data.username,
        email = data.email,
        hashed_password = data.hashed_password,
        full_name = data.full_name,
        disabled = data.disabled
    )
    session.add(new_user)
    await session.commit()
    return {"ok": True}
