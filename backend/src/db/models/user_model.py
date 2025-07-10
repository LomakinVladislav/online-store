from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import DateTime
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
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    decks = relationship("deckModel", back_populates="users")
    userdecks = relationship("userdeckModel", back_populates="users")
