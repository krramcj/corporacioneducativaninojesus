function abrirMenu(){
    document.getElementById("menuLateral").style.width = "300px";
}

function cerrarMenu(){
    document.getElementById("menuLateral").style.width = "0";
}

// ===============================
// CONEXIÓN CON SUPABASE
// ===============================
const SUPABASE_URL = "https://ugbeuddjbdxmtwselgev.supabase.co";
const SUPABASE_KEY = "sb_publishable_UdA8CudFCn5FD5s-nmc1hQ_g-30otQl";

// ===============================
// ANUNCIOS
// ===============================
async function cargarAnuncios() {
    const respuesta = await fetch(
        `${SUPABASE_URL}/rest/v1/anuncios?select=*&publicado=eq.true&order=created_at.desc`,
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        }
    );
    
    if (!respuesta.ok) {
        console.error("No se pudieron cargar los anuncios");
        return;
    }
    
    const anuncios = await respuesta.json();
    const lista = document.getElementById("lista-anuncios");
    lista.innerHTML = "";
    
    anuncios.forEach(anuncio => {
        const elemento = document.createElement("div");
        elemento.className = "anuncio";
        elemento.innerHTML = `
            <h3>${anuncio.titulo}</h3>
            ${anuncio.imagen_url ? `
                <img src="${anuncio.imagen_url}" 
                     alt="${anuncio.titulo}" 
                     class="imagen-anuncio">
            ` : ""}
            <p>${anuncio.contenido}</p>
        `;
        lista.appendChild(elemento);
    });
}

// ===============================
// GALERÍA
// ===============================
let fotosGaleria = [];
let paginaGaleria = 0;
const fotosPorPagina = 6;

async function cargarGaleria() {
    const respuesta = await fetch(
        `${SUPABASE_URL}/rest/v1/galeria?select=*&order=orden.asc`,
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        }
    );
    
    if (!respuesta.ok) {
        console.error("No se pudo cargar la galería");
        return;
    }
    
    fotosGaleria = await respuesta.json();
    mostrarGaleria();
}

function mostrarGaleria() {
    const galeria = document.getElementById("galeria");
    if (!galeria) return;
    galeria.innerHTML = "";
    
    const inicio = paginaGaleria * fotosPorPagina;
    const final = inicio + fotosPorPagina;
    const fotosMostrar = fotosGaleria.slice(inicio, final);
    
    fotosMostrar.forEach(foto => {
        const contenedor = document.createElement("div");
        contenedor.innerHTML = `
            <img src="${foto.imagen_url}" 
                 alt="Foto de la institución"
                 class="foto-galeria"
                 onclick="abrirFotoGrande('${foto.imagen_url}')">
        `;
        galeria.appendChild(contenedor);
    });
    
    actualizarFlechas();
}

function abrirFotoGrande(url) {
    const visor = document.createElement("div");
    visor.className = "visor-foto";
    visor.innerHTML = `
        <div class="visor-contenido">
            <button class="cerrar-visor" onclick="cerrarFotoGrande()">×</button>
            <img src="${url}" alt="Foto ampliada">
        </div>
    `;
    document.body.appendChild(visor);
}

function cerrarFotoGrande() {
    const visor = document.querySelector(".visor-foto");
    if (visor) {
        visor.remove();
    }
}

function galeriaSiguiente() {
    if ((paginaGaleria + 1) * fotosPorPagina < fotosGaleria.length) {
        paginaGaleria++;
        mostrarGaleria();
    }
}

function galeriaAnterior() {
    if (paginaGaleria > 0) {
        paginaGaleria--;
        mostrarGaleria();
    }
}

function actualizarFlechas() {
    const izquierda = document.querySelector(".flecha-galeria.izquierda");
    const derecha = document.querySelector(".flecha-galeria.derecha");
    if (!izquierda || !derecha) return;
    
    izquierda.style.visibility = paginaGaleria > 0 ? "visible" : "hidden";
    derecha.style.visibility = (paginaGaleria + 1) * fotosPorPagina < fotosGaleria.length ? "visible" : "hidden";
}

// ===============================
// CARGAR TODO
// ===============================
cargarAnuncios();
cargarGaleria();