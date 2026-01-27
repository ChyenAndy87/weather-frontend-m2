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
      const resCoords = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}`);
      const dataRecords = await resCoords.json();
      if (!dataRecords.results || dataRecords.results.length === 0) return null;

      const { latitude, longitude } = dataRecords.results[0];

      const resWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
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
      return {
        nombre: ciudad,
        clima: weatherCodeMap[dataWeather.current_weather.weathercode] || "Desconocido" , 
        temperatura: `${dataWeather.current_weather.temperature}°C`
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
  const max = Math.max(...pronostico.map(d => parseInt(d.tempMax)));
  const min = Math.min(...pronostico.map(d => parseInt(d.tempMin)));
  const promedio = Math.round(
    pronostico.reduce((acc,d) => acc + parseInt(d.tempMax) + parseInt(d.tempMin), 0) /
    (pronostico.length * 2)
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
}

const apiClient = new ApiClient();
const app = new WeatherApp(apiClient, ciudades);

$(document).ready(()=> {
  app.cargarLugares();
});
