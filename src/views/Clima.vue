<template>
  <div class="clima">
    <button @click="$router.back()" class="btn-back">
      <i class="fas fa-chevron-left"></i> Volver
    </button>

    <div v-if="loadingDetalle" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando clima...</p>
    </div>

    <div v-else-if="errorDetalle" class="alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ errorDetalle }}
    </div>

    <div v-else-if="ciudadSeleccionada" class="detail-wrap">
      <div class="detail-card">
        <div class="detail-header">
          <div class="detail-icon">
            <i :class="(climaActual[ciudadSeleccionada.id]?.icono || 'fas fa-cloud') + ' fa-3x'"></i>
          </div>
          <div class="detail-info">
            <h1 class="detail-city">{{ ciudadSeleccionada.nombre }}</h1>
            <p class="detail-desc">{{ climaActual[ciudadSeleccionada.id]?.descripcion }}</p>
            <div class="detail-meta">
              <span><i class="fas fa-tint"></i> {{ climaActual[ciudadSeleccionada.id]?.humedad }}% hum.</span>
              <span><i class="fas fa-wind"></i> {{ climaActual[ciudadSeleccionada.id]?.viento }} km/h</span>
              <span><i class="fas fa-thermometer-half"></i> Sensación {{ climaActual[ciudadSeleccionada.id]?.sensacion }}°C</span>
            </div>
          </div>
          <div class="detail-temp">
            {{ climaActual[ciudadSeleccionada.id]?.temp }}°C
          </div>
        </div>

        <div class="fav-action">
          <template v-if="isAuthenticated">
            <button v-if="!esFavorito" @click="ADD_FAVORITO(ciudadSeleccionada.nombre)" class="btn-fav-add">★ Agregar a favoritos</button>
            <button v-else @click="REMOVE_FAVORITO(ciudadSeleccionada.nombre)" class="btn-fav-remove">✕ Quitar de favoritos</button>
          </template>
          <router-link v-else to="/login" class="btn-fav-add">Inicia sesión para guardar</router-link>
        </div>
      </div>

      <section class="pronostico-section">
        <h2 class="section-title">Pronóstico semanal</h2>
        <div class="pronostico-list">
          <div v-for="dia in pronostico" :key="dia.dia" class="pronostico-row">
            <span class="pro-dia">{{ dia.dia }}</span>
            <i :class="dia.icono + ' pro-icono'"></i>
            <span class="pro-estado">{{ dia.descripcion }}</span>
            <span class="pro-temps">
              <span class="pro-min">{{ dia.min }}°</span> / <span class="pro-max">{{ dia.max }}°</span>
            </span>
          </div>
        </div>
      </section>

      <section v-if="estadisticas" class="estadisticas-section">
        <h2 class="section-title">Estadísticas de la semana</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Mínima</span>
            <span class="stat-value">{{ estadisticas.tempMin }}°C</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Máxima</span>
            <span class="stat-value">{{ estadisticas.tempMax }}°C</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Promedio</span>
            <span class="stat-value">{{ estadisticas.promedio }}°C</span>
          </div>
        </div>
        <div class="conteo-climas">
          <h3 class="conteo-title">Días por tipo de clima</h3>
          <div class="conteo-grid">
            <div v-for="(count, estado) in estadisticas.conteoClima" :key="estado" class="conteo-item">
              <span>{{ estado }}</span>
              <strong>{{ count }} día{{ count > 1 ? 's' : '' }}</strong>
            </div>
          </div>
        </div>
        <div class="resumen-box">
          <p class="resumen-texto">{{ estadisticas.resumen }}</p>
        </div>
      </section>

      <section v-if="estadisticas" class="alertas-section">
        <h2 class="section-title">⚠️ Alertas de clima</h2>
        <div class="alertas-list">
          <div v-for="alerta in estadisticas.alertas" :key="alerta.texto" :class="'alerta-item ' + alerta.clase">
            {{ alerta.texto }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Clima',
  computed: {
    ...mapGetters([
      'ciudadSeleccionada', 'climaActual', 'pronostico', 'estadisticas',
      'loadingDetalle', 'errorDetalle', 'isAuthenticated', 'favoritos'
    ]),
    esFavorito() {
      return this.ciudadSeleccionada && this.favoritos.includes(this.ciudadSeleccionada.nombre)
    }
  },
  methods: {
    ...mapActions(['cargarDetalle', 'cargarTodoElClima']),
    ...mapMutations(['ADD_FAVORITO', 'REMOVE_FAVORITO'])
  },
  async mounted() {
    if (this.$route.name === 'ClimaBusqueda') {
      const ciudadGuardada = sessionStorage.getItem('ciudad_busqueda')
      if (ciudadGuardada) {
        const ciudad = JSON.parse(ciudadGuardada)
        this.$store.commit('SET_CIUDAD_SELECCIONADA', { id: 0, nombre: ciudad.nombre, lat: ciudad.lat, lon: ciudad.lon })
        await this.cargarDetalle(0)
      }
    } else {
      const id = Number(this.$route.params.id)
      await this.cargarDetalle(id)
      if (Object.keys(this.climaActual).length === 0) this.cargarTodoElClima()
    }
  }
}
</script>

<style scoped>
.clima { display: flex; flex-direction: column; gap: 24px; }

.btn-back {
  align-self: flex-start;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(233,184,255,0.15);
  color: #b0b0b0;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s;
}
.btn-back:hover { color: #f5f5f5; background: rgba(168,85,247,0.12); }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px; color: #b0b0b0; }
.spinner { width: 44px; height: 44px; border: 3px solid rgba(168,85,247,0.2); border-top-color: #a855f7; border-radius: 50%; animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.alert-error { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); border-radius: 14px; color: #fb7185; }

.detail-wrap { display: flex; flex-direction: column; gap: 24px; max-width: 680px; }

.detail-card { background: rgba(20,14,35,0.92); border: 1px solid rgba(233,184,255,0.2); border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 20px; box-shadow: 0 8px 32px rgba(168,85,247,0.2); }

.detail-header { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.detail-icon i { color: #e9b8ff; }
.detail-city { font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; color: #f5f5f5; }
.detail-desc { color: #a78bfa; font-size: 0.95rem; margin-bottom: 8px; text-transform: capitalize; }
.detail-meta { display: flex; flex-wrap: wrap; gap: 14px; font-size: 0.8rem; color: #8b8b8b; }
.detail-meta i { margin-right: 4px; color: #a855f7; }

.detail-temp {
  margin-left: auto;
  font-family: 'Nunito', sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  color: #e9b8ff;
}

.fav-action { display: flex; }
.btn-fav-add { padding: 10px 20px; background: rgba(233,184,255,0.08); border: 1px solid rgba(233,184,255,0.2); border-radius: 30px; color: #e9b8ff; font-weight: 600; font-size: 0.88rem; transition: all 0.2s; text-decoration: none; }
.btn-fav-add:hover { background: rgba(233,184,255,0.16); }
.btn-fav-remove { padding: 10px 20px; background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2); border-radius: 30px; color: #fb7185; font-size: 0.88rem; transition: all 0.2s; }

.section-title { font-size: 1rem; font-weight: 700; margin-bottom: 14px; color: #f5f5f5; }

.pronostico-section, .estadisticas-section, .alertas-section { background: rgba(20,14,35,0.92); border: 1px solid rgba(233,184,255,0.15); border-radius: 20px; padding: 24px; }

.pronostico-list { display: flex; flex-direction: column; gap: 8px; }
.pronostico-row { display: flex; align-items: center; gap: 14px; padding: 10px 14px; background: rgba(20,14,35,0.65); border-radius: 10px; }
.pro-dia { min-width: 90px; font-weight: 600; font-size: 0.9rem; color: #f5f5f5; }
.pro-icono { color: #e9b8ff; }
.pro-estado { flex: 1; color: #a78bfa; font-size: 0.85rem; text-transform: capitalize; }
.pro-min { color: #b0b0b0; }
.pro-max { color: #e9b8ff; font-weight: 600; }

.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
.stat-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px; background: rgba(20,14,35,0.65); border-radius: 14px; border: 1px solid rgba(233,184,255,0.08); }
.stat-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #8b8b8b; }
.stat-value { font-family: 'Nunito', sans-serif; font-size: 1.8rem; font-weight: 800; color: #e9b8ff; }

.conteo-title { font-size: 0.88rem; font-weight: 600; color: #b0b0b0; margin-bottom: 10px; }
.conteo-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.conteo-item { display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2); border-radius: 20px; font-size: 0.82rem; color: #f5f5f5; }
.conteo-item strong { color: #e9b8ff; }

.resumen-box { padding: 16px 20px; background: rgba(233,184,255,0.05); border: 1px solid rgba(233,184,255,0.12); border-radius: 14px; }
.resumen-texto { font-size: 0.95rem; font-weight: 600; text-align: center; color: #f5f5f5; }

.alertas-list { display: flex; flex-direction: column; gap: 10px; }
.alerta-item { padding: 14px 18px; border-radius: 14px; font-weight: 600; font-size: 0.9rem; }
.alerta-calor { background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); color: #fb7185; }
.alerta-frio { background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2); color: #93c5fd; }
.alerta-lluvia { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #a5b4fc; }
.alerta-ok { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; }
</style>