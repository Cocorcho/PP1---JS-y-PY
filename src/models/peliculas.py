from typing import Annotated
from sqlalchemy import Boolean, Column, Integer, String


class Pelicula(Base):
    __tablename__ = "Peliculas"
    id = Column(Integer,primary_key=True)
    titulo = Column(String)
    director = Column(String)
    año = Column(Integer)
    activo = Column(Boolean)
