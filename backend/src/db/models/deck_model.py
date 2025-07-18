from datetime import datetime
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, relationship, mapped_column
from db.database import Base, intpk


class deckModel(Base):
    __tablename__ = "decks"  

    id: Mapped[intpk]
    creator_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str]
    category: Mapped[str]
    description: Mapped[str]
    image_url: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_public: Mapped[bool]
    difficulty: Mapped[int]

    users = relationship("userModel", back_populates="decks")
    cards = relationship("cardModel", back_populates="decks")
    favorites_decks = relationship("favoritesDecksModel", back_populates="decks", passive_deletes=True)