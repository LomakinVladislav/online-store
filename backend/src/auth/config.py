import os
from pathlib import Path
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent.parent 
ENV_PATH = BASE_DIR / "configs" / ".env"

load_dotenv(ENV_PATH)

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY не найден в .env файле")

ALGORITHM = os.getenv("ALGORITHM")
if not ALGORITHM:
    raise ValueError("SECRET_KEY не найден в .env файле")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
if not ACCESS_TOKEN_EXPIRE_MINUTES:
    raise ValueError("SECRET_KEY не найден в .env файле")

EMAIL_FROM = os.getenv("EMAIL_FROM")
if not EMAIL_FROM:
    raise ValueError("EMAIL_FROM не найден в .env файле")

EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
if not EMAIL_PASSWORD:
    raise ValueError("EMAIL_PASSWORD не найден в .env файле")