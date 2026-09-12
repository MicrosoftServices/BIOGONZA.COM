/* ============================================================
   RECICLA+ — calculadora.js
   Lógica de la calculadora de ganancias por materiales reciclables.
   ============================================================ */

/**
 * TABLA DE PRECIOS REFERENCIALES (RD$ por libra)
 * El propietario puede editar estos valores libremente.
 * Estos precios son SOLO REFERENCIALES, no representan el
 * precio final de compra.
 */
const precios = {
  cobre: 250,
  cable_cobre: 190,
  aluminio: 80,
  hierro: 12,
  acero: 18,
  plastico: 20,
  carton: 8,
  bateria: 60,
  otros: 10,
};

const nombresMaterial = {
  cobre: "Cobre",
  cable_cobre: "Cable de cobre",
  aluminio: "Aluminio",
  hierro: "Hierro",
  acero: "Acero",
  plastico: "Plástico",
  carton: "Cartón",
  bateria: "Baterías",
  otros: "Otros materiales",
};

/** Factores de conversión a libras (unidad base de la tabla de precios) */
const factorALibras = {
  lb: 1,
  kg: 2.20462,
  ton: 2204.62,
};

const formatoRD = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
  minimumFractionDigits: 2,
});

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initCalculadoraSimple();
  initCalculadoraAvanzada();
});

/* -------------------- PESTAÑAS (Simple / Avanzada) -------------------- */
function initTabs() {
  const tabs = document.querySelectorAll(".calc-tab");
  const panels = document.querySelectorAll(".calc-panel-content");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => (p.style.display = "none"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target).style.display = "block";
    });
  });
}

/* -------------------- CALCULADORA SIMPLE -------------------- */
function initCalculadoraSimple() {
  const form = document.getElementById("calcSimpleForm");
  if (!form) return;

  const resultBox = document.getElementById("calcSimpleResult");
  const waBtn = document.getElementById("calcSimpleWa");
  let ultimoCalculo = null;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const material = form.material.value;
    const cantidad = parseFloat(form.cantidad.value);
    const unidad = form.unidad.value;

    if (!material || !cantidad || cantidad <= 0) {
      resultBox.style.display = "none";
      return;
    }

    const libras = cantidad * factorALibras[unidad];
    const precioLibra = precios[material];
    const ganancia = libras * precioLibra;

    document.getElementById("calcSimpleValue").textContent = formatoRD.format(ganancia);
    document.getElementById("calcSimpleDetail").textContent =
      `${nombresMaterial[material]} · ${cantidad} ${etiquetaUnidad(unidad, cantidad)} · ${formatoRD.format(precioLibra)} / libra (referencial)`;

    resultBox.style.display = "block";

    ultimoCalculo = {
      material: nombresMaterial[material],
      cantidad,
      unidad: etiquetaUnidad(unidad, cantidad),
      ganancia,
    };
  });

  if (waBtn) {
    waBtn.addEventListener("click", () => {
      if (!ultimoCalculo) return;
      const msg =
        `Hola, realicé una estimación en su calculadora.\n\n` +
        `Material: ${ultimoCalculo.material}\n` +
        `Cantidad: ${ultimoCalculo.cantidad} ${ultimoCalculo.unidad}\n` +
        `Ganancia estimada: ${formatoRD.format(ultimoCalculo.ganancia)}\n\n` +
        `Me gustaría recibir una cotización.`;
      openWhatsApp(msg);
    });
  }
}

function etiquetaUnidad(unidad, cantidad) {
  const plural = cantidad !== 1;
  if (unidad === "lb") return plural ? "libras" : "libra";
  if (unidad === "kg") return plural ? "kilogramos" : "kilogramo";
  if (unidad === "ton") return plural ? "toneladas" : "tonelada";
  return unidad;
}

/* -------------------- CALCULADORA AVANZADA (varios materiales) -------------------- */
function initCalculadoraAvanzada() {
  const tbody = document.getElementById("calcAdvBody");
  if (!tbody) return;

  const addBtn = document.getElementById("calcAdvAdd");
  const calcBtn = document.getElementById("calcAdvCalc");
  const clearBtn = document.getElementById("calcAdvClear");
  const waBtn = document.getElementById("calcAdvWa");
  const totalBox = document.getElementById("calcAdvTotalBox");
  const totalValue = document.getElementById("calcAdvTotalValue");

  let rowId = 0;
  let filasCalculadas = [];

  function crearFila() {
    rowId++;
    const tr = document.createElement("tr");
    tr.dataset.rowId = rowId;

    const opciones = Object.keys(precios)
      .map((key) => `<option value="${key}">${nombresMaterial[key]}</option>`)
      .join("");

    tr.innerHTML = `
      <td><select class="adv-material">${opciones}</select></td>
      <td><input type="number" class="adv-cantidad" min="0" step="any" placeholder="0" /></td>
      <td>
        <select class="adv-unidad">
          <option value="lb">Libras</option>
          <option value="kg">Kilogramos</option>
          <option value="ton">Toneladas</option>
        </select>
      </td>
      <td class="adv-precio num">—</td>
      <td class="adv-total num">—</td>
      <td><button type="button" class="row-remove" aria-label="Eliminar fila"><i class="fa-solid fa-xmark"></i></button></td>
    `;

    tr.querySelector(".row-remove").addEventListener("click", () => {
      tr.remove();
    });

    tbody.appendChild(tr);
  }

  // Inicia con 3 filas de ejemplo
  crearFila();
  crearFila();
  crearFila();

  addBtn.addEventListener("click", crearFila);

  clearBtn.addEventListener("click", () => {
    tbody.innerHTML = "";
    crearFila();
    crearFila();
    crearFila();
    totalBox.style.display = "none";
    filasCalculadas = [];
  });

  calcBtn.addEventListener("click", () => {
    let total = 0;
    filasCalculadas = [];

    tbody.querySelectorAll("tr").forEach((tr) => {
      const material = tr.querySelector(".adv-material").value;
      const cantidad = parseFloat(tr.querySelector(".adv-cantidad").value) || 0;
      const unidad = tr.querySelector(".adv-unidad").value;
      const precioLibra = precios[material];
      const libras = cantidad * factorALibras[unidad];
      const subtotal = libras * precioLibra;

      tr.querySelector(".adv-precio").textContent = formatoRD.format(precioLibra) + "/lb";
      tr.querySelector(".adv-total").textContent = formatoRD.format(subtotal);

      if (cantidad > 0) {
        total += subtotal;
        filasCalculadas.push({
          material: nombresMaterial[material],
          cantidad,
          unidad: etiquetaUnidad(unidad, cantidad),
          subtotal,
        });
      }
    });

    totalValue.textContent = formatoRD.format(total);
    totalBox.style.display = "flex";
  });

  waBtn.addEventListener("click", () => {
    if (!filasCalculadas.length) {
      calcBtn.click();
    }
    if (!filasCalculadas.length) return;

    let lineas = filasCalculadas
      .map((f) => `${f.material} — ${f.cantidad} ${f.unidad}: ${formatoRD.format(f.subtotal)}`)
      .join("\n");
    let total = filasCalculadas.reduce((acc, f) => acc + f.subtotal, 0);

    const msg =
      `Hola, realicé una estimación en su calculadora avanzada.\n\n` +
      `${lineas}\n\n` +
      `TOTAL ESTIMADO: ${formatoRD.format(total)}\n\n` +
      `Me gustaría recibir una cotización.`;
    openWhatsApp(msg);
  });
}
