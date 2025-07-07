from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from db.database import Base, intpk


class deckModel(Base):
    __tablename__ = "decks"  

    id: Mapped[intpk]
    creator_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str]
    theme: Mapped[str]
    description: Mapped[str]
    image_url: Mapped[str]
    created_at: Mapped[str]  
    updated_at: Mapped[str]
    is_public: Mapped[bool]
    difficulty: Mapped[str]

    users = relationship("userModel", back_populates="decks")
    userdecks = relationship("userdeckModel", back_populates="decks")
    cards = relationship("cardModel", back_populates="decks")