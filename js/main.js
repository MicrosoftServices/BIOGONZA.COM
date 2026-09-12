/* =====================================================
   BIOGONZA SRL — JavaScript principal
   ===================================================== */

/* ============================================================
   ⚠️ IMPORTANTE — CAMBIA ESTE NÚMERO ⚠️
   Reemplaza el número de ejemplo por el WhatsApp REAL de la
   empresa. Formato: código de país + número, SIN espacios,
   sin guiones y sin el signo "+".
   Ejemplo República Dominicana: "18095551234"
   ============================================================ */
const WHATSAPP_NUMBER = "18090000000"; // ← NÚMERO DE EJEMPLO. CÁMBIALO AQUÍ.

/* ------------------------------------------------------------
   Utilidad: construye el enlace de WhatsApp con mensaje
   ------------------------------------------------------------ */
function enlaceWhatsApp(mensaje) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensaje);
}

/* Actualiza TODOS los enlaces marcados con .wa-link usando
   el número de la constante y el mensaje de su atributo data-msg */
document.querySelectorAll(".wa-link").forEach(function (enlace) {
  const msg = enlace.dataset.msg || "Hola, BIOGONZA SRL. Me gustaría recibir información.";
  enlace.href = enlaceWhatsApp(msg);
});

/* ------------------------------------------------------------
   Menú hamburguesa (móvil)
   ------------------------------------------------------------ */
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", function () {
    const abierto = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", abierto);
    menuToggle.innerHTML = abierto
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Cierra el menú al hacer clic en un enlace
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ------------------------------------------------------------
   Sombra del header al hacer scroll
   ------------------------------------------------------------ */
const header = document.getElementById("header");
window.addEventListener("scroll", function () {
  if (header) header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

/* ------------------------------------------------------------
   Animaciones de aparición al hacer scroll
   ------------------------------------------------------------ */
const observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
      observador.unobserve(entrada.target); // anima solo una vez
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(function (el) {
  observador.observe(el);
});

/* ------------------------------------------------------------
   Filtros de la galería de materiales (materiales.html)
   ------------------------------------------------------------ */
const contenedorFiltros = document.getElementById("filtros");

if (contenedorFiltros) {
  const botones = contenedorFiltros.querySelectorAll(".filtro");
  const items = document.querySelectorAll("#galeria .gal");

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      // Marca el botón activo
      botones.forEach(function (b) { b.classList.remove("active"); });
      boton.classList.add("active");

      const filtro = boton.dataset.filtro;

      items.forEach(function (item) {
        const mostrar = filtro === "todos" || item.dataset.cat === filtro;
        item.classList.toggle("oculto", !mostrar);

        // Reinicia la animación de aparición del elemento visible
        if (mostrar) {
          item.classList.remove("visible");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              item.classList.add("visible");
            });
          });
        }
      });
    });
  });
}

/* ------------------------------------------------------------
   Formulario de cotización (contacto.html)
   Valida los campos y prepara el mensaje para WhatsApp
   ------------------------------------------------------------ */
const form = document.getElementById("formCotizacion");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre   = form.querySelector("#nombre");
    const telefono = form.querySelector("#telefono");
    const correo   = form.querySelector("#correo");
    const material = form.querySelector("#material");
    const cantidad = form.querySelector("#cantidad");
    const mensaje  = form.querySelector("#mensaje");

    let valido = true;

    /* Limpia errores previos */
    form.querySelectorAll(".campo").forEach(function (c) {
      c.classList.remove("invalido");
      const err = c.querySelector(".error");
      if (err) err.textContent = "";
    });

    /* Función auxiliar para marcar errores */
    function marcarError(input, texto) {
      const campo = input.closest(".campo");
      campo.classList.add("invalido");
      const err = campo.querySelector(".error");
      if (err) err.textContent = texto;
      valido = false;
    }

    /* Validaciones */
    if (nombre.value.trim().length < 3) {
      marcarError(nombre, "Por favor escribe tu nombre completo.");
    }
    if (!/^[0-9+\-\s()]{7,20}$/.test(telefono.value.trim())) {
      marcarError(telefono, "Escribe un teléfono válido (solo números).");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim())) {
      marcarError(correo, "Escribe un correo electrónico válido.");
    }
    if (material.value === "") {
      marcarError(material, "Selecciona el material que deseas vender.");
    }
    if (cantidad.value.trim().length < 1) {
      marcarError(cantidad, "Indica una cantidad aproximada.");
    }

    if (!valido) return;

    /* Construye el mensaje para WhatsApp */
    let texto =
      "Hola, BIOGONZA SRL. Mi nombre es " + nombre.value.trim() +
      " y tengo " + cantidad.value.trim() +
      " de " + material.value +
      " para vender. Me gustaría recibir información.";

    if (mensaje.value.trim() !== "") {
      texto += " Detalles adicionales: " + mensaje.value.trim();
    }
    texto += " (Mi teléfono: " + telefono.value.trim() +
             " — Correo: " + correo.value.trim() + ")";

    /* Abre WhatsApp con el mensaje preparado */
    window.open(enlaceWhatsApp(texto), "_blank");
  });
}