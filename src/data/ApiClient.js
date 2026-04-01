export default class ApiClient {
  async getWeather(ciudad) {
    try {
      const resCoords = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}`);
      const dataCoords = await resCoords.json();
      if (!dataCoords.results || dataCoords.results.length === 0) return null;

      const { latitude, longitude } = dataCoords.results[0];
      const resWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const dataWeather = await resWeather.json();

      const weatherCodeMap = {
        0: "Despejado",
        1: "Parcialmente nublado",
        2: "Nublado",
        3: "Lluvioso",
        45: "Niebla",
        48: "Depósito de escarcha",
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
        48: "Depósito de escarcha",
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

      return { nombre: ciudad, pronostico };
    } catch (error) {
      console.error("Error getForecast:", error);
      return null;
    }
  }
}