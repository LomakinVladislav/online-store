from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError, ExpiredSignatureError
import jwt
from auth.config import SECRET_KEY, ALGORITHM
from auth.schemas import TokenDataSchema, UserInDBSchema
from auth.utils import get_user
from api.v1.common_route import SessionDep


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token") # Параметр `tokenUrl` должен указывать на URL эндпоинта для получения токена, относительно вашего приложения

async def get_current_user(session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenDataSchema(username=username)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError:
        raise credentials_exception
    
    user = await get_user(session=session, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: UserInDBSchema = Depends(get_current_user)) -> UserInDBSchema:
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user