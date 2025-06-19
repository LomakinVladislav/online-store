from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.base import api_router


origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ]

def start_application():
    
    app = FastAPI(title = "foreign_language_trainer", version="beta")
    

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    return app

app = start_application()




