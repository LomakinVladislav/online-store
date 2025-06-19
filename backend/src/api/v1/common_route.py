from fastapi import APIRouter, Depends
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.orm.common_orm import create_tables

from src.db.database import get_session

SessionDep = Annotated[AsyncSession, Depends(get_session)]

router = APIRouter()

@router.post("/create_tables")
async def create_tables_api():
    result = await create_tables()
    return result