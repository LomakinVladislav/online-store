# Файл с описанием функций (методов) для создания запросов и команд базе данных
from src.db.database import Base, async_engine


async def create_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    return {"ok": True}