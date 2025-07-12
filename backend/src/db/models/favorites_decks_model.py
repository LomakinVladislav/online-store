from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from db.database import Base, intpk


class favoritesDecksModel(Base):
    __tablename__ = "favorites_decks"  

    id: Mapped[intpk]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    deck_id: Mapped[int] = mapped_column(ForeignKey("decks.id", ondelete="CASCADE"))

    users = relationship("userModel", back_populates="favorites_decks", passive_deletes=True)
    decks = relationship("deckModel", back_populates="favorites_decks", passive_deletes=True)