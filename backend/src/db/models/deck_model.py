from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from src.db.database import Base, intpk


class deckModel(Base):
    __tablename__ = "deck"  

    id: Mapped[intpk]
    creator_user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    title: Mapped[str]
    theme: Mapped[str]
    description: Mapped[bool]
    created_at: Mapped[str]  
    updated_at: Mapped[str]
    is_public: Mapped[bool]
    difficulty: Mapped[str]

    user = relationship("userModel", back_populates="deck")
    userdeck = relationship("userdeckModel", back_populates="deck")
    card = relationship("cardModel", back_populates="deck")