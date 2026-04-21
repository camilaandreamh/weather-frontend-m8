<template>
  <div class="home">
    <div class="hero">
      <h1 class="hero-title">Bienvenido a <span class="accent">Clima Click</span></h1>
      <p class="hero-sub">El pronóstico del tiempo en Chile, actualizado en tiempo real.</p>
    </div>

    <div class="search-bar">
      <i class="fas fa-search search-icon"></i>
      <input
        v-model="busqueda"
        @input="onBuscar"
        @keyup.enter="buscarCiudad"
        type="text"
        placeholder="Buscar cualquier ciudad de Chile... (ej: Chillán, Curicó)"
        class="search-input"
      />
      <button v-if="busqueda" @click="limpiarBusqueda" class="btn-clear">✕</button>
    </div>

    <div v-if="loadingBusqueda" class="search-loading">
      <div class="spinner-sm"></div>
      <span>Buscando {{ busqueda }}...</span>
    </div>

    <div v-if="errorBusqueda" class="alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ errorBusqueda }}
    </div>

    <div v-if="resultadoBusqueda" class="search-result">
      <div class="result-card" @click="irAlDetalle(resultadoBusqueda)">
        <div class="result-header">
          <h3>{{ resultadoBusqueda.nombre }}</h3>
          <span class="result-temp">{{ resultadoBusqueda.temp }}°C</span>
        </div>
        <p class="result-desc">{{ resultadoBusqueda.descripcion }}</p>
        <div class="result-meta">
          <span><i class="fas fa-tint"></i> {{ resultadoBusqueda.humedad }}%</span>
          <span><i class="fas fa-wind"></i> {{ resultadoBusqueda.viento }} km/h</span>
        </div>
        <button class="btn-ver-detalle">Ver detalle →</button>
      </div>
    </div>

    <div v-if="errorClima" class="alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ errorClima }}
      <button @click="recargar" class="btn-retry">Reintentar</button>
    </div>

    <div v-if="!isAuthenticated" class="cta-banner">
      <div class="cta-text">
        <strong>¿Quieres guardar tus ciudades favoritas?</strong>
        <span>Crea una cuenta o inicia sesión para personalizar tu experiencia.</span>
      </div>
      <div class="cta-btns">
        <router-link to="/login" class="cta-login">Iniciar sesión</router-link>
        <router-link to="/registro" class="cta-reg">Crear cuenta</router-link>
      </div>
    </div>

    <h2 class="section-title">Ciudades destacadas</h2>

    <div class="cities-grid">
      <WeatherCard
        v-for="ciudad in ciudades"
        :key="ciudad.id"
        :ciudad="ciudad"
        :clima="climaActual[ciudad.id]"
        :cargando="loadingClima && !climaActual[ciudad.id]"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import WeatherCard from '../components/WeatherCard.vue'
import axios from 'axios'

const API_KEY = 'c22f76991ecdeabe3084df1356af0ff0'

export default {
  name: 'Home',
  components: { WeatherCard },
  data() {
    return {
      busqueda: '',
      resultadoBusqueda: null,
      loadingBusqueda: false,
      errorBusqueda: null,
      busquedaTimer: null
    }
  },
  computed: {
    ...mapGetters(['ciudades', 'climaActual', 'loadingClima', 'errorClima', 'isAuthenticated'])
  },
  methods: {
    ...mapActions(['cargarTodoElClima']),
    recargar() { this.cargarTodoElClima() },

    onBuscar() {
      this.resultadoBusqueda = null
      this.errorBusqueda = null
      if (!this.busqueda.trim() || this.busqueda.trim().length < 5) return
      clearTimeout(this.busquedaTimer)
      this.busquedaTimer = setTimeout(() => { this.buscarCiudad() }, 1000)
    },

    async buscarCiudad() {
     if (!this.busqueda.trim() || this.busqueda.trim().length < 5) return
      this.loadingBusqueda = true
      this.errorBusqueda = null
      this.resultadoBusqueda = null
      try {
        let data
        try {
          const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: { q: `${this.busqueda.trim()},CL`, appid: API_KEY, units: 'metric', lang: 'es' }
          })
          data = res.data
        } catch {
          const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: { q: this.busqueda.trim(), appid: API_KEY, units: 'metric', lang: 'es' }
          })
          data = res.data
        }
        this.resultadoBusqueda = {
          nombre: data.name,
          temp: Math.round(data.main.temp),
          descripcion: data.weather[0].description,
          humedad: data.main.humidity,
          viento: Math.round(data.wind.speed * 3.6),
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      } catch {
        this.errorBusqueda = `No se encontró "${this.busqueda}". Intenta con el nombre completo.`
      } finally {
        this.loadingBusqueda = false
      }
    },

    irAlDetalle(ciudad) {
      const encontrada = this.ciudades.find(c => c.nombre.toLowerCase() === ciudad.nombre.toLowerCase())
      if (encontrada) {
        this.$router.push(`/clima/${encontrada.id}`)
      } else {
        sessionStorage.setItem('ciudad_busqueda', JSON.stringify(ciudad))
        this.$router.push(`/clima/busqueda`)
      }
    },

    limpiarBusqueda() {
      this.busqueda = ''
      this.resultadoBusqueda = null
      this.errorBusqueda = null
    }
  },
  mounted() {
    if (Object.keys(this.climaActual).length === 0) this.cargarTodoElClima()
  }
}
</script>

<style scoped>
.home { display: flex; flex-direction: column; gap: 28px;width: 100%; max-width: 100%; padding: 0 16px;}
.hero { max-width: 700px; }
.hero-title { font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.04em; margin-bottom: 12px; }
.accent { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero-sub { color: var(--text2); font-size: 1rem; }
.search-bar { position: relative; max-width: 560px; display: flex; align-items: center; }
.search-icon { position: absolute; left: 16px; color: var(--text3); font-size: 0.85rem; z-index: 1; }
.search-input { width: 100%; padding: 14px 44px 14px 42px; background: var(--surface); border: 1px solid var(--border2); border-radius: 18px; font-size: 0.9rem; transition: border-color 0.2s, box-shadow 0.2s; }
.search-input:focus { border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(124,58,237,0.15), 0 0 20px rgba(124,58,237,0.1); }
.btn-clear { position: absolute; right: 14px; background: none; color: var(--text3); font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; transition: color 0.2s; }
.btn-clear:hover { color: var(--text); }
.search-loading { display: flex; align-items: center; gap: 10px; color: var(--text2); font-size: 0.88rem; }
.spinner-sm { width: 18px; height: 18px; border: 2px solid rgba(124,58,237,0.2); border-top-color: var(--secondary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.search-result { max-width: 560px; }
.result-card { background: var(--surface); border: 1px solid rgba(124,58,237,0.3); border-radius: var(--radius); padding: 20px 24px; cursor: pointer; transition: all 0.25s; box-shadow: 0 0 20px rgba(124,58,237,0.1); }
.result-card:hover { border-color: var(--secondary); box-shadow: 0 0 35px rgba(124,58,237,0.3); transform: translateY(-3px); }
.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.result-header h3 { font-size: 1.2rem; font-weight: 700; }
.result-temp { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 800; color: var(--primary); }
.result-desc { color: var(--text2); font-size: 0.88rem; margin-bottom: 10px; text-transform: capitalize; }
.result-meta { display: flex; gap: 16px; font-size: 0.8rem; color: var(--text3); margin-bottom: 14px; }
.result-meta i { margin-right: 4px; color: var(--secondary); }
.btn-ver-detalle { padding: 8px 18px; border-radius: 20px; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.25); color: var(--secondary); font-size: 0.85rem; font-weight: 600; transition: all 0.2s; }
.btn-ver-detalle:hover { background: rgba(124,58,237,0.25); }
.alert-error { display: flex; align-items: center; gap: 12px; padding: 14px 18px; max-width: 560px; background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); border-radius: var(--radius-sm); color: var(--error); font-size: 0.9rem; }
.btn-retry { margin-left: auto; padding: 6px 14px; border-radius: 8px; background: rgba(244,63,94,0.15); color: var(--error); font-size: 0.85rem; border: 1px solid rgba(244,63,94,0.2); }
.cta-banner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; padding: 20px 24px; border-radius: var(--radius); background: var(--surface); border: 1px solid rgba(240,180,41,0.1); }
.cta-text { display: flex; flex-direction: column; gap: 4px; }
.cta-text strong { color: var(--text); }
.cta-text span { font-size: 0.88rem; color: var(--text2); }
.cta-btns { display: flex; gap: 10px; }
.cta-login { padding: 10px 18px; border-radius: var(--radius-xs); background: rgba(124,58,237,0.15); color: var(--text); font-size: 0.88rem; font-weight: 600; }
.cta-reg { padding: 10px 18px; border-radius: var(--radius-xs); background: var(--secondary); color: white; font-size: 0.88rem; font-weight: 600; }
.section-title { font-size: 1.1rem; font-weight: 700; color: var(--text2); }
.cities-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; width: 100%;
}
</style>