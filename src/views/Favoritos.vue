<template>
  <div class="favoritos">
    <div class="page-header">
      <h1>Mis Favoritos</h1>
      <p class="page-sub">Tus ciudades guardadas, {{ usuario.nombre.split(' ')[0] }} 😊</p>
    </div>

    <div v-if="favoritos.length === 0" class="empty-state">
      <div class="empty-icon">☆</div>
      <p>Todavía no tienes ciudades favoritas.</p>
      <p class="empty-hint">Busca una ciudad en el inicio y presiona ★</p>
    </div>

    <div v-else class="cities-grid">
      <WeatherCard
        v-for="nombre in favoritos"
        :key="nombre"
        :ciudad="getCiudad(nombre)"
        :clima="climaActual[getCiudad(nombre)?.id]"
        :cargando="loadingClima && !climaActual[getCiudad(nombre)?.id]"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import WeatherCard from '../components/WeatherCard.vue'

export default {
  name: 'Favoritos',
  components: { WeatherCard },
  computed: {
    ...mapGetters(['favoritos', 'usuario', 'ciudades', 'climaActual', 'loadingClima'])
  },
  methods: {
    ...mapActions(['cargarTodoElClima']),
    getCiudad(nombre) { return this.ciudades.find(c => c.nombre === nombre) || { id: 0, nombre } }
  },
  mounted() {
    if (Object.keys(this.climaActual).length === 0) this.cargarTodoElClima()
  }
}
</script>

<style scoped>
.favoritos { display: flex; flex-direction: column; gap: 28px; }
.page-header h1 { font-size: 2rem; font-weight: 800; margin-bottom: 6px; }
.page-sub { color: var(--text2); }
.empty-state { text-align: center; padding: 60px 20px; color: var(--text2); }
.empty-icon { font-size: 3rem; color: var(--primary); margin-bottom: 12px; }
.empty-hint { font-size: 0.85rem; color: var(--text3); margin-top: 6px; }
.cities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }
</style>
