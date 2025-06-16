from sqlalchemy.orm import Mapped, relationship
from db.database import Base, intpk


class userModel(Base):
    __tablename__ = "user"  

    id: Mapped[intpk]
    username: Mapped[str]
    email: Mapped[str]
    password: Mapped[str]
    # birth_date: Mapped[str] Можно использовать для реализации фанкционала Permissions

    deck = relationship("deckModel", back_populates="user")
    userdeck = relationship("userdeckModel", back_populates="user")
