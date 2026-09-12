/* ============================================================
   RECICLA+ — contacto.js
   Validación del formulario de contacto / cotización.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successBox = document.getElementById("contactSuccess");

  const validators = {
    nombre: (v) => v.trim().length >= 3 || "Escribe tu nombre completo.",
    telefono: (v) =>
      /^[0-9+()\s-]{7,15}$/.test(v.trim()) || "Ingresa un teléfono válido.",
    correo: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Ingresa un correo válido.",
    material: (v) => v !== "" || "Selecciona un material.",
    cantidad: (v) => (v.trim() !== "" && parseFloat(v) > 0) || "Ingresa una cantidad válida.",
    mensaje: (v) => v.trim().length >= 10 || "Cuéntanos un poco más (mínimo 10 caracteres).",
  };

  function showError(field, message) {
    const wrapper = field.closest(".field");
    wrapper.classList.add("has-error");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(field) {
    const wrapper = field.closest(".field");
    wrapper.classList.remove("has-error");
  }

  function validateField(field) {
    const rule = validators[field.name];
    if (!rule) return true;
    const result = rule(field.value);
    if (result === true) {
      clearError(field);
      return true;
    } else {
      showError(field, result);
      return false;
    }
  }

  // Validación en tiempo real al salir del campo
  Object.keys(validators).forEach((name) => {
    const field = form.elements[name];
    if (field) {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".field").classList.contains("has-error")) {
          validateField(field);
        }
      });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successBox.classList.remove("show");

    let esValido = true;
    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      if (field && !validateField(field)) esValido = false;
    });

    if (!esValido) {
      const primerError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
      if (primerError) primerError.focus();
      return;
    }

    // Simulación de envío exitoso (sin backend conectado).
    // Aquí se podría integrar un servicio de correo o una API propia.
    successBox.classList.add("show");
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });

    const materialTexto = form.material.options[form.material.selectedIndex].text;
    const resumen =
      `Hola, quisiera solicitar una cotización.\n\n` +
      `Nombre: ${form.nombre.value}\n` +
      `Teléfono: ${form.telefono.value}\n` +
      `Correo: ${form.correo.value}\n` +
      `Material: ${materialTexto}\n` +
      `Cantidad: ${form.cantidad.value}\n` +
      `Mensaje: ${form.mensaje.value}`;

    const sendWaBtn = document.getElementById("contactSendWa");
    if (sendWaBtn) {
      sendWaBtn.onclick = () => openWhatsApp(resumen);
      sendWaBtn.style.display = "inline-flex";
    }

    form.reset();
  });
});
