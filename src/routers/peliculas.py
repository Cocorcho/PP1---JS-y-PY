from typing import Annotated
from fastapi import HTTPException, Path, APIRouter
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

peliculas_db = [
    {"id": 1, "titulo": "El Padrino", "director": "Francis Ford Coppola", "año": 1972},
    {"id": 2, "titulo": "El Caballero Oscuro", "director": "Christopher Nolan", "año": 2008},
    {"id": 3, "titulo": "Backrooms", "director": "Kane Person", "año": 2026},
]

@peliculas_routers.get("/")
async def obtener_peliculas():
    return peliculas_db

@peliculas_routers.get("/{id}", responses=NOT_FOUND_RESPONSE)
async def obtener_pelicula(id: Annotated[int, Path(description="ID de la película")]):
    for pelicula in peliculas_db:
        if pelicula["id"] == id:
            return pelicula
    raise HTTPException(status_code=404, detail="Artículo no encontrado")

@peliculas_routers.post("/")
async def crear_pelicula(pelicula: PeliculaSchema):
    nueva_pelicula = {
        "id": len(peliculas_db) + 1,
        "titulo": pelicula.titulo,
        "director": pelicula.director,
        "año": pelicula.año,
    }
    peliculas_db.append(nueva_pelicula)
    return nueva_pelicula

@peliculas_routers.put("/{id}", responses=NOT_FOUND_RESPONSE)
async def actualizar_pelicula(
    id: Annotated[int, Path(gt=0, description="ID de la película a actualizar")],
    pelicula_update: PeliculaUpdate,
):
    for pelicula in peliculas_db:
        if pelicula["id"] == id:
            pelicula["titulo"] = pelicula_update.titulo
            pelicula["director"] = pelicula_update.director
            pelicula["año"] = pelicula_update.año
            return pelicula
    raise HTTPException(status_code=404, detail="Artículo no encontrado")

@peliculas_routers.delete("/{id}", responses=NOT_FOUND_RESPONSE)
async def eliminar_pelicula(id: Annotated[int, Path(description="ID de la película a eliminar")]):
    for pelicula in peliculas_db:
        if pelicula["id"] == id:
            peliculas_db.remove(pelicula)
            return {"detail": "Pelicula eliminada"}
    raise HTTPException(status_code=404, detail="Artículo no encontrado")
