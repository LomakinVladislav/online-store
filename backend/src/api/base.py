from fastapi import APIRouter
from api.v1 import deck_route
from api.v1 import user_route
from api.v1 import auth_route


api_router = APIRouter()
api_router.include_router(deck_route.router, prefix="", tags=["deck_route"])
api_router.include_router(user_route.router, prefix="", tags=["user_route"])
api_router.include_router(auth_route.router, prefix="", tags=["auth_route"])
