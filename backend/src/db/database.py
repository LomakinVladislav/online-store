from typing import Annotated

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, mapped_column

from src.config import settings

async_engine = create_async_engine(
    url=settings.DATABASE_URL_asyncpg,
    echo=True,
)

print("Настройки подключения к базе: " + settings.DATABASE_URL_asyncpg)

async_session_factory = async_sessionmaker(async_engine)

async def get_session():
    async with async_session_factory() as session:
        yield session

class Base(DeclarativeBase):
    pass

# Кастомный тип для использования в моделях в качестве Primary Key
intpk = Annotated[int, mapped_column(primary_key=True)]