const ciudades = [
  {
    nombre: "New York",
    clima: "Soleado",
    temperatura: "25°C",
    humedad: "40%"
  },
  {
    nombre: "Tokyo",
    clima: "Nublado",
    temperatura: "18°C",
    humedad: "60%"
  },
  {
    nombre: "Londres",
    clima: "Lluvioso",
    temperatura: "15°C",
    humedad: "70%"
  },
  {
    nombre: "Madrid",
    clima: "Soleado",
    temperatura: "24°C",
    humedad: "45%"
  },
  {
    nombre: "París",
    clima: "Nublado",
    temperatura: "20°C",
    humedad: "55%"
  },
  {
    nombre: "Buenos Aires",
    clima: "Soleado",
    temperatura: "25°C",
    humedad: "40%"
  },
  {
    nombre: "Santiago",
    clima: "Nublado",
    temperatura: "18°C",
    humedad: "60%"
  },
  {
    nombre: "Valparaíso",
    clima: "Lluvioso",
    temperatura: "15°C",
    humedad: "70%"
  },
  {
    nombre: "El Quisco",
    clima: "Soleado",
    temperatura: "24°C",
    humedad: "45%"
  },
  {
    nombre: "Concepción",
    clima: "Nublado",
    temperatura: "20°C",
    humedad: "55%"
  }
];

$(document).ready(function () {

  ciudades.forEach(ciudad => {
   const cardHTML = `
  <div class="col-12 col-md-4 mb-3">
    <article class="card p-3 ciudad-card" 
             data-ciudad="${ciudad.nombre}" 
             style="cursor:pointer" 
             role="button" 
             tabindex="0"
             aria-label="Ver pronóstico semanal de ${ciudad.nombre}">

      <h5 class="card-title">${ciudad.nombre}</h5>
      <p class="card-text">Clima: ${ciudad.clima}</p>
      <p class="card-text">Temperatura: ${ciudad.temperatura}</p>
      <p class="card-text">Humedad: ${ciudad.humedad}</p>
    </article>
  </div>
`;


    $("#ciudades-row").append(cardHTML);
  });

});
$(document).on("click", ".ciudad-card", function () {

   $(".ciudad-card").removeClass("ciudad-activa"); 
  $(this).addClass("ciudad-activa");
  
  const ciudadSeleccionada = $(this).data("ciudad");

   if (!ciudadSeleccionada) {
    alert("Error: No se pudo cargar la información de la ciudad.");
    return;
  }

  // Ocultar Home y mostrar Detalle
  $("#home-section").addClass("d-none");
  $("#detalle-section").removeClass("d-none");

  // Mostrar el nombre de la ciudad
  $("#detalle-ciudad").text(`Pronóstico semanal: ${ciudadSeleccionada}`);

  // Limpiar pronóstico anterior
  $("#pronostico-row").empty();

  // Datos de ejemplo para pronóstico semanal
  const pronosticoMock = [
    { dia: "Lunes", clima: "Soleado", tempMax: "26°C", tempMin: "18°C" },
    { dia: "Martes", clima: "Nublado", tempMax: "24°C", tempMin: "17°C" },
    { dia: "Miércoles", clima: "Lluvioso", tempMax: "20°C", tempMin: "15°C" },
    { dia: "Jueves", clima: "Soleado", tempMax: "25°C", tempMin: "16°C" },
    { dia: "Viernes", clima: "Nublado", tempMax: "23°C", tempMin: "18°C" },
    { dia: "Sábado", clima: "Soleado", tempMax: "27°C", tempMin: "19°C" },
    { dia: "Domingo", clima: "Lluvioso", tempMax: "21°C", tempMin: "15°C" },
  ];

  if (!pronosticoMock || pronosticoMock.length === 0) {
    $("#pronostico-row").html(`
      <p class="text-danger">No hay datos disponibles para esta ciudad.</p>
    `);
    return; // detiene la ejecución
  }

  pronosticoMock.forEach(dia => {
    const cardDia = `
      <div class="col-6 col-sm-4 col-lg-2 mb-3">
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

$(document).on("keypress", ".ciudad-card", function(e) {
  if (e.key === "Enter" || e.key === " ") {
    $(this).click(); // dispara el mismo comportamiento que un click
  }
});

// Permitir activar card con Enter o Space
$(document).on("keydown", ".ciudad-card", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    $(this).click(); // dispara el mismo flujo del click
  }
});


//keypress

$("#back-home").on("click", function () {
  $("#detalle-section").addClass("d-none");
  $("#home-section").removeClass("d-none");
});
// Navbar: Home
$("#nav-home").on("click", function(e) {
  e.preventDefault(); // evita que el enlace recargue la página
  $("#detalle-section").addClass("d-none");
  $("#home-section").removeClass("d-none");
});

// Navbar: Detalle
$("#nav-detalle").on("click", function(e) {
    if ($(this).hasClass("disabled")) {  // Si tiene la clase disabled
        e.preventDefault(); // No hace nada
        return; // Sale de la función
    }
    
    // Acción normal si no está deshabilitado
    $("#home-section").addClass("d-none");
    $("#detalle-section").removeClass("d-none");
});
