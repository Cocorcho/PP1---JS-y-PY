from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.peliculas import peliculas_routers


cine_app = FastAPI()

cine_app.title = "API de Cine"
cine_app.version = "1.0.0"

cine_app.include_router(peliculas_routers, tags=["Peliculas"], prefix="/peliculas")


cine_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500",
                   "http://127.0.0.1:5500",
                   "http://127.0.0.1:8000",
                ],
    allow_methods=["*"],
    allow_headers=["*"],
)