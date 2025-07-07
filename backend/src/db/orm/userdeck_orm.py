# Файл с описанием функций (методов) для создания запросов и команд базе данных
from sqlalchemy.orm import Session

from db.models.userdeck_model import userdeckModel
from db.schemas.userdeck_shemas import UserDeckAddSchema

async def add_userdeck(data: UserDeckAddSchema, session: Session):
    new_userdeck = userdeckModel(
        user_id=data.user_id,
        deck_id=data.deck_id,
        added_at=data.added_at, 
        progress=data.progress  
    )
    session.add(new_userdeck)
    await session.commit()
    return {"ok": True}
