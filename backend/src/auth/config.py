import os
from pathlib import Path
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent.parent 
ENV_PATH = BASE_DIR / "configs" / ".env"

load_dotenv(ENV_PATH)

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY не найден в .env файле")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
