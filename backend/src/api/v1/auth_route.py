from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from auth.utils import authenticate_user, create_access_token, validate_reset_token
from auth.schemas import TokenSchema
from auth.config import ACCESS_TOKEN_EXPIRE_MINUTES
from api.v1.common_route import SessionDep


router = APIRouter()

@router.post("/auth/token", response_model=TokenSchema)
async def login_for_access_token(session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(session=session, username=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = await create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/auth/validate_reset_token/")
async def validate_reset_token_endpoint(session: SessionDep, reset_token: str = Query(..., description="Reset password token")):
    is_valid = await validate_reset_token(session=session, reset_token=reset_token)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired token"
        )
    return {"valid": True}