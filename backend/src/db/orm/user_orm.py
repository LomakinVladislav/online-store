# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session

from db.models.user_model import userModel
from db.schemas.user_schemas import UserAddSchema

async def add_user(data: UserAddSchema, session: Session):
    new_user = userModel(
        id = data.id,
        username = data.username,
        email = data.email,
        password = data.password
    )
    session.add(new_user)
    await session.commit()
    return {"ok": True}
