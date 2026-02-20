const ciudades = [
  { nombre: "New York", humedad: "40%" },
  { nombre: "Tokyo", humedad: "60%" },
  { nombre: "Londres", humedad: "70%" },
  { nombre: "Madrid", humedad: "45%" },
  { nombre: "París", humedad: "55%" },
  { nombre: "Buenos Aires", humedad: "40%" },
  { nombre: "Santiago", humedad: "60%" },
  { nombre: "Valparaíso", humedad: "70%" },
  { nombre: "El Quisco", humedad: "45%" },
  { nombre: "Concepción", humedad: "55%" }
];

class ApiClient {
  async getWeather(ciudad) {
  try {
    // Obtener coordenadas de la ciudad
    const resCoords = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}`);
    const dataCoords = await resCoords.json();
    if (!dataCoords.results || dataCoords.results.length === 0) return null;

    const { latitude, longitude } = dataCoords.results[0];

    // Traer clima actual
    const resWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const dataWeather = await resWeather.json();

    // Mapear códigos de clima a texto
    const weatherCodeMap = {
      0: "Despejado",
      1: "Parcialmente nublado",
      2: "Nublado",
      3: "Lluvioso",
      45: "Niebla",
      48: "Deposito de escarcha",
      51: "Llovizna ligera",
      53: "Llovizna moderada",
      55: "Llovizna intensa",
      61: "Lluvia ligera",
      63: "Lluvia moderada",
      65: "Lluvia intensa",
      80: "Chubascos",
      81: "Chubascos fuertes",
      82: "Tormenta",
    };

    return {
      clima: weatherCodeMap[dataWeather.current_weather.weathercode] || "Desconocido",
      temperatura: dataWeather.current_weather.temperature
    };

  } catch (error) {
    console.error("Error getWeather:", error);
    return null;
  }
}


   async getForecast(ciudad) {
    try {
      const resCoords = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}`);
      const dataRecords = await resCoords.json();
      if (!dataRecords.results || dataRecords.results.length === 0) return null;

      const { latitude, longitude } = dataRecords.results[0];

      const resWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);

      const dataWeather = await resWeather.json();

       const weatherCodeMap = {
        0: "Despejado",
        1: "Parcialmente nublado",
        2: "Nublado",
        3: "Lluvioso",
        45: "Niebla",
        48: "Deposito de escarcha",
        51: "Llovizna ligera",
        53: "Llovizna moderada",
        55: "Llovizna intensa",
        61: "Lluvia ligera",
        63: "Lluvia moderada",
        65: "Lluvia intensa",
        80: "Chubascos",
        81: "Chubascos fuertes",
        82: "Tormenta",
      };
       const pronostico = dataWeather.daily.time.map((fecha, i) => ({
        dia: fecha,
        tempMax: dataWeather.daily.temperature_2m_max[i],
        tempMin: dataWeather.daily.temperature_2m_min[i],
        clima: weatherCodeMap[dataWeather.daily.weathercode[i]] || "Desconocido"
      }));
      return {
        nombre: ciudad,
        pronostico
      };

    } catch (error) {
      console.error("Error ApiClient:", error);
      return null;
    }

    }
  }


class WeatherApp {
  constructor(apiClient,ciudades){
    this.apiClient = apiClient;
    this.ciudades = ciudades;
  }

  async cargarLugares() {
  $("#ciudades-row").html("<p>cargando ciudades ...</p>");


  for (const ciudad of this.ciudades){
    try {
    const clima = await this.apiClient.getWeather(ciudad.nombre);
      if ($("#ciudades-row p").length) {
        $("#ciudades-row").empty();
      }
    this.renderCiudad(ciudad, clima);
  } catch(error) {
    console.error(error);
     if ($("#ciudades-row p").length) {
        $("#ciudades-row").empty();
      }

    this.renderCiudad(ciudad, null);

  }
  }
}

renderCiudad(ciudad, clima){
  const cardHTML = `
  <div class="col-12 col-md-6 col-lg-4">
    <article class= "place-card card p-3" 
     data-ciudad="${ciudad.nombre}"
     tabindex="0"
     role="button">
     <h5>${ciudad.nombre}</h5>
     <p>Clima: ${clima?.clima || "N/A"}</p>
     <p>Temperatura: ${clima?.temperatura || "N/A"}</p>
     <p>Humedad: ${ciudad.humedad}</p>
   </article>
  </div>`;

$("#ciudades-row").append(cardHTML);
}

calcularEstadisticas(pronostico){
 const max = Math.max(...pronostico.map(d => d.tempMax));
const min = Math.min(...pronostico.map(d => d.tempMin));
const promedio = Math.round(
  pronostico.reduce((acc,d) => acc + d.tempMax + d.tempMin, 0) / (pronostico.length * 2)
);


  return { min, max, promedio};
}

generarAlertas(pronostico) {
  const lluvia = pronostico.filter(d=> d.clima === "Lluvioso").length;
  const alertas = [];

  if (lluvia >= 3) alertas.push("Semana lluviosa");
  if (this.calcularEstadisticas(pronostico).promedio > 30) alertas.push("Alerta de calor");
  return alertas;
}
async cargarDetalle(ciudadNombre) {
  const data = await this.apiClient.getForecast(ciudadNombre);
  if (!data) return alert("No se pudo cargar el pronóstico");

  $("#detalle-ciudad").text(data.nombre);
  $("#pronostico-row").empty();

  // Render cards diarias
  data.pronostico.forEach(d => {
    const cardHTML = `
      <div class="col-12 col-md-4">
        <div class="card p-2">
          <h6>${d.dia}</h6>
          <p>Clima: ${d.clima}</p>
          <p>Máx: ${d.tempMax}°C</p>
          <p>Mín: ${d.tempMin}°C</p>
        </div>
      </div>`;
    $("#pronostico-row").append(cardHTML);
  });

  // Contar días por tipo de clima
const diasPorClima = data.pronostico.reduce((acc, d) => {
  acc[d.clima] = (acc[d.clima] || 0) + 1;
  return acc;
}, {});

// Obtener los 2 tipos de clima más frecuentes
const topClimas = Object.entries(diasPorClima)
  .sort((a, b) => b[1] - a[1]) // ordenar descendente por cantidad
  .slice(0, 2); // tomar los dos primeros


const resumenTopClimas = topClimas
  .map(([clima, cantidad]) => `${cantidad} días ${clima}`)
  .join(", ");



  // Estadísticas
  const stats = this.calcularEstadisticas(data.pronostico);
  const alertas = this.generarAlertas(data.pronostico);

  $("#pronostico-row").append(`
  <div class="col-12 mt-3">
    <h5>Estadísticas de la semana</h5>
    <p>Máxima: ${stats.max}°C, Mínima: ${stats.min}°C, Promedio: ${stats.promedio}°C</p>
    <h5>Días por tipo de clima</h5>
    <p>${resumenTopClimas}</p>
    <h5>Alertas</h5>
    <p>${alertas.length ? alertas.join(", ") : "Sin alertas"}</p>
  </div>
`);
}
}




const apiClient = new ApiClient();
const app = new WeatherApp(apiClient, ciudades);

$(document).ready(()=> {
  app.cargarLugares();
});

// Click en una card para ir al detalle
$(document).on("click", ".place-card", function() {
  const ciudad = $(this).data("ciudad");
  $("#home-section").addClass("d-none");
  $("#detalle-section").removeClass("d-none");

  app.cargarDetalle(ciudad);
});

// Botón "volver" al Home
$("#back-home").on("click", function() {
  $("#detalle-section").addClass("d-none");
  $("#home-section").removeClass("d-none");
});
