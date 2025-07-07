from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from db.database import Base, intpk


class cardModel(Base):
    __tablename__ = "cards"

    id: Mapped[intpk]
    deck_id: Mapped[int] = mapped_column(ForeignKey("decks.id"))
    front_text: Mapped[str]
    back_text: Mapped[str]
    transcription: Mapped[str]
    image_url: Mapped[str]

    deck = relationship("deckModel", back_populates="cards")