from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.base import api_router
import uvicorn


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
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


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)