# ClimaApp 🌤️

## 1. Descripción breve
ClimaApp es una aplicación web que muestra el **clima actual** de distintas ciudades del mundo en tarjetas dinámicas. Permite visualizar:
- Nombre de la ciudad
- Clima actual (ej: despejado, lluvioso)
- Temperatura actual en °C
- Humedad

El objetivo es aprender a consumir **APIs externas** y mostrar la información de forma clara y visual.

---

## 2. Estructura de clases

La app se organiza en **dos clases principales**:

1. **ApiClient**  
   - Encargada de comunicarse con las APIs externas.  
   - Métodos:
     - `getWeather(ciudad)`: obtiene coordenadas de la ciudad y luego consulta el clima actual.  

2. **WeatherApp**  
   - Controla la lógica de la aplicación.  
   - Métodos principales:
     - `cargarLugares()`: recorre las ciudades y llama a `ApiClient` para obtener datos, luego renderiza las cards.  
     - `renderCiudad(ciudad, clima)`: genera la card HTML con los datos de la ciudad.  
     - `calcularEstadisticas(pronostico)`: calcula máximas, mínimas y promedio de temperaturas (no usado en la vista actual).  
     - `generarAlertas(pronostico)`: analiza si hay lluvia o calor extremo para mostrar alertas (no usado en la vista actual).

---

## 3. API de clima utilizada

- **Nombre:** Open-Meteo  
- **API de geocoding:** https://geocoding-api.open-meteo.com/v1/search?name={ciudad}  
- **API de clima:** https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true  
- Documentación oficial: [Open-Meteo Docs](https://open-meteo.com/en/docs)

> Se usa primero la API de geocoding para obtener latitud y longitud de la ciudad, y luego se consulta el clima actual.

---

## 4. Estadísticas

En esta versión se calcula:
- **Máxima:** mayor temperatura registrada (`tempMax`)  
- **Mínima:** menor temperatura registrada (`tempMin`)  
- **Promedio:** promedio de máximas y mínimas  
- **Alertas:** si hay más de 3 días lluviosos → “Semana lluviosa”; si el promedio supera 30°C → “Alerta de calor”  

> Nota: en la versión actual solo se muestran las cards; estas estadísticas se preparan para funcionalidades futuras.

---

## 5. Enlace al repositorio

- Repositorio público: [https://github.com/ChyenAndy87/weather-frontend-m2](https://github.com/ChyenAndy87/weather-frontend-m2)
