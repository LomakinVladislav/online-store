# Файл с описанием функций (методов) для создания запросов и команд базе данных
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models.user_model import userModel
from db.schemas.user_schemas import UserAddSchema
from auth.utils import get_password_hash


async def add_user(data: UserAddSchema, session: Session):
    existing_user = await session.execute(
        select(userModel).where(userModel.username == data.username)
    )
    if existing_user.scalar():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким именем уже существует"
        )
    
    existing_email = await session.execute(
        select(userModel).where(userModel.email == data.email)
    )
    if existing_email.scalar():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с такой почтой уже существует"
        )
    
    new_user = userModel(
        username = data.username,
        email = data.email,
        hashed_password=get_password_hash(data.password),
        full_name = data.full_name,
        disabled = False
    )
    session.add(new_user)
    await session.commit()
    return {"ok": True}
