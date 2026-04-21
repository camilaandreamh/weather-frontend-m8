// =============================================
// MÓDULO 8 — Clima Click
// Servicio de API: OpenWeatherMap
// Autora: Camila Andrea Molina Hernández
// =============================================

import axios from 'axios'

const API_KEY = 'c22f76991ecdeabe3084df1356af0ff0'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Ciudades chilenas con sus coordenadas
export const CIUDADES = [
  { id: 1,  nombre: 'Santiago',     lat: -33.46, lon: -70.65 },
  { id: 2,  nombre: 'Valparaíso',   lat: -33.05, lon: -71.62 },
  { id: 3,  nombre: 'Antofagasta',  lat: -23.65, lon: -70.40 },
  { id: 4,  nombre: 'Concepción',   lat: -36.82, lon: -73.05 },
  { id: 5,  nombre: 'La Serena',    lat: -29.91, lon: -71.25 },
  { id: 6,  nombre: 'Temuco',       lat: -38.74, lon: -72.59 },
  { id: 7,  nombre: 'Coronel',      lat: -37.02, lon: -73.14 },
  { id: 8,  nombre: 'Arica',        lat: -18.48, lon: -70.33 },
  { id: 9,  nombre: 'Iquique',      lat: -20.21, lon: -70.15 },
  { id: 10, nombre: 'Rancagua',     lat: -34.17, lon: -70.74 },
  { id: 11, nombre: 'Talca',        lat: -35.43, lon: -71.67 },
  { id: 12, nombre: 'Puerto Montt', lat: -41.47, lon: -72.94 },
  { id: 13, nombre: 'Valdivia',     lat: -39.81, lon: -73.24 },
  { id: 14, nombre: 'Osorno',       lat: -40.57, lon: -73.13 }
]

// Traduce descripción del clima al español
const traducirClima = (desc) => {
  const traducciones = {
    'clear sky': 'Despejado',
    'few clouds': 'Pocas nubes',
    'scattered clouds': 'Nubes dispersas',
    'broken clouds': 'Muy nublado',
    'overcast clouds': 'Cubierto',
    'light rain': 'Lluvia ligera',
    'moderate rain': 'Lluvia moderada',
    'heavy intensity rain': 'Lluvia intensa',
    'thunderstorm': 'Tormenta',
    'snow': 'Nieve',
    'mist': 'Neblina',
    'drizzle': 'Llovizna',
    'shower rain': 'Chubascos'
  }
  return traducciones[desc] || desc
}

// Obtiene icono según descripción
export const obtenerIcono = (desc) => {
  const d = desc.toLowerCase()
  if (d.includes('clear') || d.includes('despejado')) return 'fas fa-sun'
  if (d.includes('few clouds') || d.includes('pocas')) return 'fas fa-cloud-sun'
  if (d.includes('rain') || d.includes('lluvia') || d.includes('drizzle') || d.includes('llovizna')) return 'fas fa-cloud-rain'
  if (d.includes('thunder') || d.includes('tormenta')) return 'fas fa-bolt'
  if (d.includes('snow') || d.includes('nieve')) return 'fas fa-snowflake'
  if (d.includes('mist') || d.includes('neblina')) return 'fas fa-smog'
  return 'fas fa-cloud'
}

// Clima actual de una ciudad
export const obtenerClimaActual = async (lat, lon, unidad = 'metric') => {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat, lon,
      appid: API_KEY,
      units: unidad,
      lang: 'es'
    }
  })
  return {
    temp: Math.round(data.main.temp),
    sensacion: Math.round(data.main.feels_like),
    humedad: data.main.humidity,
    viento: Math.round(data.wind.speed * 3.6),
    descripcion: traducirClima(data.weather[0].description),
    icono: obtenerIcono(data.weather[0].description),
    iconoCodigo: data.weather[0].icon
  }
}

// Pronóstico de 5 días
export const obtenerPronostico = async (lat, lon, unidad = 'metric') => {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat, lon,
      appid: API_KEY,
      units: unidad,
      lang: 'es',
      cnt: 40
    }
  })

  // Agrupar por día
  const porDia = {}
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  data.list.forEach(item => {
    const fecha = new Date(item.dt * 1000)
    const clave = fecha.toDateString()
    if (!porDia[clave]) {
      porDia[clave] = {
        dia: dias[fecha.getDay()],
        temps: [],
        descripciones: [],
        iconos: []
      }
    }
    porDia[clave].temps.push(item.main.temp)
    porDia[clave].descripciones.push(item.weather[0].description)
    porDia[clave].iconos.push(item.weather[0].icon)
  })

  return Object.values(porDia).slice(0, 7).map(dia => {
    const descMasFrecuente = dia.descripciones
      .sort((a, b) => dia.descripciones.filter(v => v === a).length - dia.descripciones.filter(v => v === b).length)
      .pop()
    return {
      dia: dia.dia,
      min: Math.round(Math.min(...dia.temps)),
      max: Math.round(Math.max(...dia.temps)),
      descripcion: traducirClima(descMasFrecuente),
      icono: obtenerIcono(descMasFrecuente)
    }
  })
}

// Calcular estadísticas del pronóstico
export const calcularEstadisticas = (pronostico) => {
  let tempMin = pronostico[0].min
  let tempMax = pronostico[0].max
  let sumaPromedios = 0
  const conteoClima = {}

  for (const dia of pronostico) {
    if (dia.min < tempMin) tempMin = dia.min
    if (dia.max > tempMax) tempMax = dia.max
    sumaPromedios += (dia.min + dia.max) / 2
    conteoClima[dia.descripcion] = (conteoClima[dia.descripcion] || 0) + 1
  }

  const promedio = Math.round(sumaPromedios / pronostico.length)

  let climaMasFrecuente = ''
  let maxConteo = 0
  for (const estado in conteoClima) {
    if (conteoClima[estado] > maxConteo) {
      maxConteo = conteoClima[estado]
      climaMasFrecuente = estado
    }
  }

  let resumen = ''
  const desc = climaMasFrecuente.toLowerCase()
  if (desc.includes('despejado') || desc.includes('clear')) resumen = '☀️ Semana mayormente despejada.'
  else if (desc.includes('lluvia') || desc.includes('rain')) resumen = '🌧️ Semana lluviosa, lleva paraguas.'
  else if (desc.includes('nublado') || desc.includes('cloud')) resumen = '☁️ Semana nublada con pocas aclaraciones.'
  else resumen = '⛅ Semana con clima variable.'

  // Generar alertas
  const alertas = []
  if (promedio > 28) alertas.push({ texto: '🌡️ Alerta de calor: temperatura promedio muy alta.', clase: 'alerta-calor' })
  if (promedio < 8) alertas.push({ texto: '🥶 Alerta de frío: semana con temperaturas bajas.', clase: 'alerta-frio' })
  const diasLluvia = pronostico.filter(d => d.descripcion.toLowerCase().includes('lluvia') || d.descripcion.toLowerCase().includes('llovizna')).length
  if (diasLluvia >= 3) alertas.push({ texto: `🌧️ Semana lluviosa: ${diasLluvia} días con lluvia previstos.`, clase: 'alerta-lluvia' })
  if (alertas.length === 0) alertas.push({ texto: '✅ Sin alertas esta semana. Clima estable.', clase: 'alerta-ok' })

  return { tempMin, tempMax, promedio, conteoClima, climaMasFrecuente, resumen, alertas }
}
