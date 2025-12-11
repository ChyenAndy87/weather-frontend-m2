// Datos de ejemplo
const ciudades = [
  { nombre: "New York", clima: "Soleado", temperatura: "25°C", humedad: "40%" },
  { nombre: "Tokyo", clima: "Nublado", temperatura: "18°C", humedad: "60%" },
  { nombre: "Londres", clima: "Lluvioso", temperatura: "15°C", humedad: "70%" },
  { nombre: "Madrid", clima: "Soleado", temperatura: "24°C", humedad: "45%" },
  { nombre: "París", clima: "Nublado", temperatura: "20°C", humedad: "55%" },
  { nombre: "Buenos Aires", clima: "Soleado", temperatura: "25°C", humedad: "40%" },
  { nombre: "Santiago", clima: "Nublado", temperatura: "18°C", humedad: "60%" },
  { nombre: "Valparaíso", clima: "Lluvioso", temperatura: "15°C", humedad: "70%" },
  { nombre: "El Quisco", clima: "Soleado", temperatura: "24°C", humedad: "45%" },
  { nombre: "Concepción", clima: "Nublado", temperatura: "20°C", humedad: "55%" }
];

// -----------------------------------------------------------------------------
// CREAR LAS CARDS DINÁMICAMENTE
// -----------------------------------------------------------------------------
$(document).ready(function () {

  ciudades.forEach(ciudad => {
    const cardHTML = `
      <div class="col-12 col-md-6 col-lg-4">
        <article class="place-card card p-3"
                data-ciudad="${ciudad.nombre}"
                tabindex="0"
                role="button"
                aria-label="Ver pronóstico semanal de ${ciudad.nombre}">

          <h5 class="place-card__name">${ciudad.nombre}</h5>
          <p class="place-card__clima">Clima: ${ciudad.clima}</p>
          <p class="place-card__temp">Temperatura: ${ciudad.temperatura}</p>
          <p class="place-card__hum">Humedad: ${ciudad.humedad}</p>

        </article>
      </div>
    `;

    $("#ciudades-row").append(cardHTML);
  });

});

// -----------------------------------------------------------------------------
// EVENTO: AL HACER CLICK EN UNA CARD
// -----------------------------------------------------------------------------
$(document).on("click", ".place-card", function () {

  // Activar visualmente la card seleccionada
  $(".place-card").removeClass("place-card--active");
  $(this).addClass("place-card--active");

  const ciudadSeleccionada = $(this).data("ciudad");

  if (!ciudadSeleccionada) {
    alert("Error: No se pudo cargar la información de la ciudad.");
    return;
  }

  // Mostrar sección de detalle
  $("#home-section").addClass("d-none");
  $("#detalle-section").removeClass("d-none");

  // Actualizar título del detalle
  $("#detalle-ciudad").text(`Pronóstico semanal: ${ciudadSeleccionada}`);

  // Limpiar sección anterior
  $("#pronostico-row").empty();

  // Datos de ejemplo del pronóstico semanal
  const pronosticoMock = [
    { dia: "Lunes", clima: "Soleado", tempMax: "26°C", tempMin: "18°C" },
    { dia: "Martes", clima: "Nublado", tempMax: "24°C", tempMin: "17°C" },
    { dia: "Miércoles", clima: "Lluvioso", tempMax: "20°C", tempMin: "15°C" },
    { dia: "Jueves", clima: "Soleado", tempMax: "25°C", tempMin: "16°C" },
    { dia: "Viernes", clima: "Nublado", tempMax: "23°C", tempMin: "18°C" },
    { dia: "Sábado", clima: "Soleado", tempMax: "27°C", tempMin: "19°C" },
    { dia: "Domingo", clima: "Lluvioso", tempMax: "21°C", tempMin: "15°C" }
  ];

  // Si no hay pronóstico
  if (!pronosticoMock.length) {
    $("#pronostico-row").html(`
      <p class="text-danger">No hay datos disponibles para esta ciudad.</p>
    `);
    return;
  }

  // Renderizar cards del pronóstico
  pronosticoMock.forEach(dia => {
    const cardDia = `
      <div class="col-6 col-sm-4 col-lg-2">
        <article class="card p-2 text-center">
          <h6>${dia.dia}</h6>
          <p>${dia.clima}</p>
          <p>Max: ${dia.tempMax}</p>
          <p>Min: ${dia.tempMin}</p>
        </article>
      </div>
    `;
    $("#pronostico-row").append(cardDia);
  });

});

// -----------------------------------------------------------------------------
// ACTIVAR CARD CON ENTER O ESPACIO (ACCESIBILIDAD)
// -----------------------------------------------------------------------------
$(document).on("keydown", ".place-card", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    $(this).click();
  }
});

// -----------------------------------------------------------------------------
// BOTÓN VOLVER AL HOME
// -----------------------------------------------------------------------------
$("#back-home").on("click", function () {
  $("#detalle-section").addClass("d-none");
  $("#home-section").removeClass("d-none");
});

// -----------------------------------------------------------------------------
// NAVBAR: HOME
// -----------------------------------------------------------------------------
$("#nav-home").on("click", function (e) {
  e.preventDefault();
  $("#detalle-section").addClass("d-none");
  $("#home-section").removeClass("d-none");
});

// -----------------------------------------------------------------------------
// NAVBAR: DETALLE
// (se activa solo si no está "disabled")
// -----------------------------------------------------------------------------
$("#nav-detalle").on("click", function (e) {
  if ($(this).hasClass("disabled")) {
    e.preventDefault();
    return;
  }

  $("#home-section").addClass("d-none");
  $("#detalle-section").removeClass("d-none");
});
