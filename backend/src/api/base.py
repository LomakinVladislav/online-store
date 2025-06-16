from fastapi import APIRouter
from api.v1 import common_route
from api.v1 import card_route
from api.v1 import deck_route
from api.v1 import user_route
from api.v1 import userdeck_route


api_router = APIRouter()
api_router.include_router(common_route.router,prefix="", tags=["common_route"])
api_router.include_router(card_route.router,prefix="", tags=["card_route"])
api_router.include_router(deck_route.router,prefix="", tags=["deck_route"])
api_router.include_router(user_route.router,prefix="", tags=["user_route"])
api_router.include_router(userdeck_route.router,prefix="", tags=["userdeck_route"])
