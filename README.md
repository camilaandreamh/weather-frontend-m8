# Clima Click — Módulo 8 (Portafolio Final)

¡Hola! Soy Camila y este es el portafolio final de mi App de Clima. Integra todo lo aprendido durante el bootcamp: Vue 3, Vue Router, Vuex, consumo de API real con Axios y diseño responsivo.

## Demo en vivo

🌐 https://camilaandreamh.github.io/weather-frontend-m8/

## Repositorio

https://github.com/camilaandreamh/weather-frontend-m8

## Funcionalidades clave

- **Clima en tiempo real** desde OpenWeatherMap para 14 ciudades chilenas
- **Sistema de usuarios** con login, registro y cierre de sesión
- **Favoritos** — guarda tus ciudades preferidas (requiere sesión)
- **Pronóstico de 7 días** con estadísticas semanales
- **Alertas meteorológicas** automáticas (calor, frío, lluvia)
- **Preferencias** de unidad °C / °F por usuario
- **Buscador** de ciudades en tiempo real
- **Manejo de errores** y estados de carga visibles

## API utilizada

- **Nombre:** OpenWeatherMap
- **URL base:** `https://api.openweathermap.org/data/2.5`
- **Documentación:** https://openweathermap.org/api
- **API Key:** Incluida en `src/services/weatherService.js`
- **Plan gratuito:** 60 llamadas/minuto

## Rutas principales

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Home con todas las ciudades |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Crear cuenta |
| `/clima/:id` | Público | Detalle de ciudad + pronóstico + alertas |
| `/favoritos` | Privado | Ciudades favoritas del usuario |
| `/perfil` | Privado | Preferencias y cierre de sesión |

## Cuentas de prueba

```
Email: camila@skater.com   Contraseña: skate
Email: andrea@skater.com   Contraseña: Ollie
```

## Instalación y uso local

### Requisitos
- Node.js v18 o superior
- npm v9 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/camilaandreamh/weather-frontend-m8.git

# 2. Entrar a la carpeta
cd weather-frontend-m8

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev
```

Abre http://localhost:5173 en tu navegador.

### Build para producción

```bash
npm run build
```

Los archivos compilados quedan en la carpeta `dist/`.

## Stack tecnológico

- Vue 3
- Vue Router 4 (Hash History)
- Vuex 4
- Axios
- Vite
- OpenWeatherMap API

## Autora

Camila Andrea Molina Hernández — Coronel, Chile — 2026
