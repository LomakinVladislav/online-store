from datetime import datetime, timedelta
import secrets
from sqlalchemy import delete, select
from sqlalchemy.orm import Session
from db.models.reset_password_model import resetPasswordModel
from db.models.user_model import userModel
from auth.utils import send_reset_email, get_password_hash


def generate_token() -> str:
    return secrets.token_urlsafe(32)


async def initiate_password_reset(email: str, session: Session) -> bool:
    query = select(userModel).filter(userModel.email == email)
    result  = await session.execute(query)
    user = result .scalar_one_or_none()
    if not user:
        return False
    
    token = generate_token()
    expires = datetime.utcnow() + timedelta(hours=1)

    delete_query = delete(resetPasswordModel).where(resetPasswordModel.user_id == user.id)
    await session.execute(delete_query)

    reset_entry = resetPasswordModel(
        user_id=user.id,
        reset_token=token,
        reset_token_expires=expires
    )
    session.add(reset_entry)
    await session.commit()
    
    reset_link = f"http://yourfrontend.com/reset-password?token={token}"
    await send_reset_email(email, reset_link)
    
    return True


async def complete_password_reset(token: str, new_password: str, session: Session) -> userModel | None:
    query = (
        select(resetPasswordModel).where(
            resetPasswordModel.reset_token == token,
            resetPasswordModel.reset_token_expires > datetime.utcnow()
        ))
    result = await session.execute(query)
    reset_entry = result.scalar_one_or_none()
    
    if not reset_entry:
        return None

    user_query = select(userModel).where(userModel.id == reset_entry.user_id)
    user_result = await session.execute(user_query)
    user = user_result.scalar_one_or_none()
    
    if not user:
        return None

    user.hashed_password = get_password_hash(new_password)
    await session.delete(reset_entry)
    await session.commit()
    return user
