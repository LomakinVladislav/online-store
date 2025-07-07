from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from db.database import Base, intpk


class userdeckModel(Base):
    __tablename__ = "userdecks"

    id: Mapped[intpk]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    deck_id: Mapped[int] = mapped_column(ForeignKey("decks.id"))
    added_at: Mapped[str]
    progress: Mapped[float]

    deck = relationship("deckModel", back_populates="userdecks")
    user = relationship("userModel", back_populates="userdecks")