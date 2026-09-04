from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, Query, Depends
from sqlalchemy.orm import Session
from database import get_db

from models.peliculas import Pelicula
from schemas.peliculas import PeliculaSchema, PeliculaUpdate

peliculas_routers = APIRouter()

NOT_FOUND_RESPONSE = {
    404: {
        "description": "Response not found si no se encuentra el id",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Artículo no encontrado",
                }
            }
        },
    },
}


@peliculas_routers.get("/", response_model=list[PeliculaSchema])
async def obtener_peliculas(db: Session = Depends(get_db)):
    peliculas = db.query(Pelicula).all()
    return peliculas

@peliculas_routers.get("/{id}", responses=NOT_FOUND_RESPONSE, responses_model = PeliculaSchema)
async def obtener_pelicula(id: Annotated[int, Path(gt=0)], db:Session = Depends(get_db)):
    peliculas_obtenidas = db.get(Pelicula,id)
    if peliculas_obtenidas is None:
        return peliculas_obtenidas
    else:
        return HTTPException(status_code=404, detail="Articulo no encontrado")

@peliculas_routers.post("/", responses_model = PeliculaSchema)
async def crear_pelicula(pelicula: PeliculaSchema, db:Session = Depends(get_db)):

    pelicula_db = Pelicula(
        titulo = titulo_nuevo.titulo,
        director = director_nuevo.director,
        año = año_nuevo.año
    )
    db.add(pelicula_db)
    db.commit()
    db.refresh(pelicula_db)

    return pelicula_db


@peliculas_routers.put("/{id}", responses=NOT_FOUND_RESPONSE, response_model=(PeliculaSchema))
async def actualizar_pelicula(
    id: Annotated[int, Path(gt=0, description="ID de la película a actualizar")],
    pelicula_update: PeliculaUpdate,
    db:Session = Depends(get_db),
):

    pelicula_obtenidas = db.get(Pelicula,id)
    if pelicula_obtenidas is not None:
        pelicula_obtenidas.titulo = pelicula_editar.titulo
        pelicula_obtenidas.director = pelicula_editar.director
        pelicula_obtenidas.año = pelicula_editar.año
        pelicula_obtenidas.activo = pelicula_editar.activo
        db.commit()
        db.refresh(pelicula_obtenidas)
        return(pelicula_obtenidas)

    raise HTTPException(status_code=404, detail="Articulo no encontrado")
@peliculas_routers.delete("/{id}", responses=NOT_FOUND_RESPONSE)
async def eliminar_pelicula(id: Annotated[int, Path(gt=0)], db:Session = Depends(get_db)):
