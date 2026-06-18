
// Variables globales //
const API_URL = "http://127.0.0.1:8000/peliculas";
let peliculasCargadas = [];

// referencias del DOM //
const gallery = document.getElementById("gallery");
const favoritosList = document.getElementById("favoritos-list");

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const navSearchBtn = document.getElementById("nav-search-btn");
const navProfileBtn = document.getElementById("nav-profile-btn");
const searchSection = document.getElementById("search-section");
const profileSection = document.getElementById("profile-section");

const addMovieBtn = document.getElementById("add-movie-btn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDetalle = document.getElementById("modal-detalle");
const modalForm = document.getElementById("modal-form");
const modalClose = document.getElementById("modal-close");

const formId = document.getElementById("form-id");
const formTitulo = document.getElementById("form-titulo");
const formDirector = document.getElementById("form-director");
const formAnio = document.getElementById("form-anio");


//   HELPERS DE LOCALSTORAGE (favoritos) // 

// devuelve el array de favoritos
function getFavoritos() {
  const data = localStorage.getItem("favoritos");
  return data ? JSON.parse(data) : [];
}

// guarda el array de favoritos completo
function setFavoritos(favoritos) {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// Revisa si esta la pelicula en favoritos
function esFavorito(id) {
  const favoritos = getFavoritos();
  return favoritos.some((peli) => peli.id === id);
}

// agrega o quita una pelicula de favoritos
function toggleFavorito(pelicula) {
  let favoritos = getFavoritos();

  if (esFavorito(pelicula.id)) {
    favoritos = favoritos.filter((peli) => peli.id !== pelicula.id);
  } else {
    favoritos.push(pelicula);
  }

  setFavoritos(favoritos);

  // Refresh
  renderPeliculas(peliculasCargadas);
  renderFavoritos();
}

//   PETICIONES A LA API // 

// GET
async function getPeliculas() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Error al obtener las peliculas");
    }

    const data = await res.json();
    peliculasCargadas = data;
    renderPeliculas(peliculasCargadas);
  } catch (error) {
    console.log(error);
    gallery.innerHTML = `
      <p class="text-red-400 col-span-full text-center">
        No se pudo conectar con la API. Verifica que el servidor (uvicorn) este corriendo.
      </p>`;
  }
}

// GET By Id
async function getPeliculaPorId(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      throw new Error("No se encontro la pelicula");
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    alert("No se pudo obtener el detalle de la pelicula");
    return null;
  }
}

// POST
async function crearPelicula(pelicula) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pelicula),
    });

    if (!res.ok) {
      throw new Error("No se pudo crear la pelicula");
    }

    await getPeliculas();
  } catch (error) {
    console.log(error);
    alert("Ocurrio un error al crear la pelicula");
  }
}

// PUT
async function editarPelicula(id, pelicula) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pelicula),
    });

    if (!res.ok) {
      throw new Error("No se pudo editar la pelicula");
    }

    await getPeliculas();
  } catch (error) {
    console.log(error);
    alert("Ocurrio un error al editar la pelicula");
  }
}

// DELETE
async function eliminarPelicula(id) {
  const confirmar = confirm("Seguro que querés eliminar esta pelicula?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("No se pudo eliminar la pelicula");
    }

    // si la pelicula estaba en favoritos, la sacamos tambien de ahi
    let favoritos = getFavoritos();
    favoritos = favoritos.filter((peli) => peli.id !== id);
    setFavoritos(favoritos);

    await getPeliculas();
    renderFavoritos();
  } catch (error) {
    console.log(error);
    alert("Ocurrio un error al eliminar la pelicula");
  }
}

//   RENDERS  //

// dibuja las cards de peliculas
function renderPeliculas(lista) {
  gallery.innerHTML = "";

  if (!lista || lista.length === 0) {
    gallery.innerHTML = `<p class="text-slate-400 col-span-full text-center">No hay peliculas para mostrar</p>`;
    return;
  }

  lista.forEach((pelicula) => {
    const favoritoActivo = esFavorito(pelicula.id);

    const card = document.createElement("div");
    card.className =
      "bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2 hover:border-cyan-500/50 transition-colors duration-300";

    card.innerHTML = `
      <div class="flex justify-between items-start gap-2">
        <h3 class="text-lg font-bold">${pelicula.titulo}</h3>
        <button class="fav-btn text-2xl leading-none ${favoritoActivo ? "text-pink-500" : "text-slate-500"}" 
          data-id="${pelicula.id}" title="Agregar/quitar de favoritos">
          ${favoritoActivo ? "♥" : "♡"}
        </button>
      </div>

      <p class="text-sm text-slate-400">Director: ${pelicula.director}</p>
      <p class="text-sm text-slate-400">Año: ${pelicula.año}</p>

      <div class="flex gap-2 mt-3">
        <button class="detalle-btn flex-1 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg px-2 py-1.5 transition-colors" 
          data-id="${pelicula.id}">
          Ver mas
        </button>
        <button class="editar-btn flex-1 bg-cyan-600 hover:bg-cyan-500 text-sm rounded-lg px-2 py-1.5 transition-colors" 
          data-id="${pelicula.id}">
          Editar
        </button>
        <button class="eliminar-btn flex-1 bg-red-600 hover:bg-red-500 text-sm rounded-lg px-2 py-1.5 transition-colors" 
          data-id="${pelicula.id}">
          Eliminar
        </button>
      </div>
    `;

    gallery.appendChild(card);
  });

  agregarEventosCards();
}

// dibuja las cards de "Mi Perfil"
function renderFavoritos() {
  const favoritos = getFavoritos();
  favoritosList.innerHTML = "";

  if (favoritos.length === 0) {
    favoritosList.innerHTML = `<p class="text-slate-400 col-span-full text-center">Todavia no agregaste ninguna pelicula a favoritos</p>`;
    return;
  }

  favoritos.forEach((pelicula) => {
    const card = document.createElement("div");
    card.className =
      "bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2";

    card.innerHTML = `
      <h3 class="text-lg font-bold">${pelicula.titulo}</h3>
      <p class="text-sm text-slate-400">Director: ${pelicula.director}</p>
      <p class="text-sm text-slate-400">Año: ${pelicula.año}</p>
      <button class="quitar-fav-btn mt-3 bg-pink-600 hover:bg-pink-500 text-sm rounded-lg px-2 py-1.5 transition-colors" 
        data-id="${pelicula.id}">
        Quitar de favoritos
      </button>
    `;

    favoritosList.appendChild(card);
  });

//   EVENTOS  //

  // evento para sacar peliculas de favoritos desde "Mi Perfil"
  document.querySelectorAll(".quitar-fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const pelicula = getFavoritos().find((peli) => peli.id === id);
      toggleFavorito(pelicula);
    });
  });
}

// Agrega los eventos a las cards
function agregarEventosCards() {

  // ver el detalle de una pelicula (GET by id)
  document.querySelectorAll(".detalle-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.id);
      const pelicula = await getPeliculaPorId(id);
      if (pelicula) mostrarDetalle(pelicula);
    });
  });

  // marcar / desmarcar favorito
  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const pelicula = peliculasCargadas.find((peli) => peli.id === id);
      if (pelicula) toggleFavorito(pelicula);
    });
  });

  // editar pelicula
  document.querySelectorAll(".editar-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.id);
      const pelicula = await getPeliculaPorId(id);
      if (pelicula) mostrarFormulario(pelicula);
    });
  });

  // eliminar pelicula
  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      eliminarPelicula(id);
    });
  });
}

// abre el modal en modo "solo lectura" con el detalle de la pelicula
function mostrarDetalle(pelicula) {
  modalTitle.textContent = pelicula.titulo;

  modalDetalle.classList.remove("hidden");
  modalForm.classList.add("hidden");

  modalDetalle.innerHTML = `
    <p><span class="text-slate-500">ID:</span> ${pelicula.id}</p>
    <p><span class="text-slate-500">Director:</span> ${pelicula.director}</p>
    <p><span class="text-slate-500">Año:</span> ${pelicula.año}</p>
  `;

  modal.classList.remove("hidden");
}

// abre el modal en modo formulario, para crear (sin parametro) o editar (con pelicula)
function mostrarFormulario(pelicula = null) {
  modalDetalle.classList.add("hidden");
  modalForm.classList.remove("hidden");
  modalForm.reset();

  if (pelicula) {
    modalTitle.textContent = "Editar pelicula";
    formId.value = pelicula.id;
    formTitulo.value = pelicula.titulo;
    formDirector.value = pelicula.director;
    formAnio.value = pelicula.año;
  } else {
    modalTitle.textContent = "Agregar pelicula";
    formId.value = "";
  }

  modal.classList.remove("hidden");
}

// cerrar el modal
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// boton de "+ Agregar pelicula" -> abre el modal vacio
addMovieBtn.addEventListener("click", () => {
  mostrarFormulario();
});

// submit del formulario: si tiene id es edicion (PUT), sino es creacion (POST)
modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    titulo: formTitulo.value,
    director: formDirector.value,
    año: Number(formAnio.value),
  };

  if (formId.value) {
    await editarPelicula(formId.value, datos);
  } else {
    // la api pide un campo "id" en el body, pero igual lo recalcula sola
    datos.id = 0;
    await crearPelicula(datos);
  }

  modal.classList.add("hidden");
});

// buscador: filtra sobre las peliculas que ya tenemos cargadas,
// no hace falta volver a pedirle nada a la api
searchBtn.addEventListener("click", () => {
  const texto = searchInput.value.toLowerCase().trim();

  const filtradas = peliculasCargadas.filter((pelicula) =>
    pelicula.titulo.toLowerCase().includes(texto)
  );

  renderPeliculas(filtradas);
});

// navegacion entre "Explorar" y "Mi Perfil"
navSearchBtn.addEventListener("click", () => {
  searchSection.classList.remove("hidden");
  profileSection.classList.add("hidden");

  navSearchBtn.classList.add("text-cyan-400", "border-b-2", "border-cyan-400");
  navProfileBtn.classList.remove("text-cyan-400", "border-b-2", "border-cyan-400");
});

navProfileBtn.addEventListener("click", () => {
  profileSection.classList.remove("hidden");
  searchSection.classList.add("hidden");

  navProfileBtn.classList.add("text-cyan-400", "border-b-2", "border-cyan-400");
  navSearchBtn.classList.remove("text-cyan-400", "border-b-2", "border-cyan-400");

  renderFavoritos();
});


// =====================================================
//   ARRANQUE
// =====================================================
getPeliculas();
renderFavoritos();