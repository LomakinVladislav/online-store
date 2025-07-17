from fastapi import APIRouter, HTTPException
from fastapi import APIRouter, HTTPException
from db.schemas.reset_password_schemas import ForgotPasswordRequest, ResetPasswordRequest
from db.orm.reset_password_orm import initiate_password_reset, complete_password_reset
from api.v1.common_route import SessionDep

router = APIRouter()


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, session: SessionDep):
    success = await initiate_password_reset(email=request.email, session=session)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password reset email sent"}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, session: SessionDep):
    user = await complete_password_reset(token=request.token, new_password=request.new_password, session=session)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"message": "Password updated successfully"}