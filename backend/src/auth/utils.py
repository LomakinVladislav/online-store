from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models.user_model import userModel
import jwt
from auth.config import SECRET_KEY, ALGORITHM
from auth.schemas import UserInDBSchema
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from auth.config import EMAIL_FROM, EMAIL_PASSWORD 



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    print(f"Checking password: {plain_password}")
    print(f"Against hash: {hashed_password}")
    
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Password verification failed: {str(e)}")
        return False

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def get_user(session: Session, username: str) -> UserInDBSchema | None:
    query = select(userModel).filter(userModel.username == username)
    result = await session.execute(query)   
    user = result.scalars().first()
    if user:
        return UserInDBSchema(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            disabled=user.disabled,
            hashed_password=user.hashed_password
        )
    return None

async def authenticate_user(session: Session, username: str, password: str) -> UserInDBSchema | None:
    user = await get_user(session, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

async def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Восстановление пароля пользователем

async def send_reset_email(email: str, reset_link: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Сброс пароля"
    msg["From"] = EMAIL_FROM
    msg["To"] = email
    
    text = f"""Для сброса пароля перейдите по ссылке:\n{reset_link}\n\n"""
    text += "Если вы не запрашивали сброс, проигнорируйте это письмо."
    
    html = f"""<html>
    <body>
      <p>Для сброса пароля перейдите по ссылке:</p>
      <p><a href="{reset_link}">Сбросить пароль</a></p>
      <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
    </body>
    </html>"""
    
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))
    
    try:
        with smtplib.SMTP("smtp.mail.ru", 587, timeout=10) as server:
            server.starttls()
            server.login(EMAIL_FROM, EMAIL_PASSWORD)
            server.send_message(msg)
            return True
    except smtplib.SMTPException as e:
        print(f"SMTP ошибка: {e}")
        return False
    except Exception as e:
        print(f"Общая ошибка: {e}")
        return False