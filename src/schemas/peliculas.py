from typing import Annotated
from pydantic import BaseModel, Field

titulo_pelicula = Annotated[str, Field(description="Título de la película")]
director_pelicula = Annotated[str, Field(description="Director de la película")]
año_pelicula = Annotated[int, Field(description="Año de lanzamiento de la película")]


class PeliculaSchema(BaseModel):
    id: Annotated[int, Field(description="ID de la película")]
    titulo: titulo_pelicula
    director: director_pelicula
    año: año_pelicula

class PeliculaUpdate(BaseModel):
    titulo: titulo_pelicula
    director: director_pelicula
    año: año_pelicula
