from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import TIMESTAMP
from db.database import Base, intpk
from datetime import datetime


class userModel(Base):
    __tablename__ = "users"  

    id: Mapped[intpk]
    username: Mapped[str]
    email: Mapped[str]
    full_name: Mapped[str]
    hashed_password: Mapped[str]
    disabled: Mapped[bool]
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, server_default='NOW()')

    deck = relationship("deckModel", back_populates="user")
    userdeck = relationship("userdeckModel", back_populates="user")
