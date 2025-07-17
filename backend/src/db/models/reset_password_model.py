from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, relationship, mapped_column
from db.database import Base, intpk
from datetime import datetime


class resetPasswordModel(Base):
    __tablename__ = "reset_passwords"  

    id: Mapped[intpk]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    reset_token: Mapped[str] = mapped_column(nullable=True)
    reset_token_expires: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, \
                                                          onupdate=datetime.utcnow, nullable=True)

    users = relationship("userModel", back_populates="reset_passwords", passive_deletes=True)

