<template>
  <article class="place-card" @click="irAlDetalle">
    <div v-if="cargando" class="card-loading">
      <div class="sk-icon"></div>
      <div class="sk-text"></div>
      <div class="sk-text sk-text--sm"></div>
    </div>
    <template v-else-if="clima">
      <header class="place-card__header">
        <h3 class="place-card__title">{{ ciudad.nombre }}</h3>
        <button
          v-if="isAuthenticated"
          class="fav-btn"
          @click.stop="toggleFav"
          :title="esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        >{{ esFavorito ? '★' : '☆' }}</button>
      </header>
      <div class="place-card__body">
        <i :class="clima.icono + ' weather-icon'"></i>
        <div class="place-card__temp">{{ clima.temp }}{{ unidadSimbolo }}</div>
        <p class="place-card__status">{{ clima.descripcion }}</p>
        <div class="card-meta">
          <span><i class="fas fa-tint"></i> {{ clima.humedad }}%</span>
          <span><i class="fas fa-wind"></i> {{ clima.viento }} km/h</span>
        </div>
      </div>
      <div class="card-glow"></div>
    </template>
  </article>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'WeatherCard',
  props: {
    ciudad: { type: Object, required: true },
    clima: { type: Object, default: null },
    cargando: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'favoritos', 'preferencias']),
    esFavorito() { return this.favoritos.includes(this.ciudad.nombre) },
    unidadSimbolo() { return this.preferencias.unidad === 'F' ? '°F' : '°C' }
  },
  methods: {
    ...mapMutations(['ADD_FAVORITO', 'REMOVE_FAVORITO']),
    irAlDetalle() { this.$router.push(`/clima/${this.ciudad.id}`) },
    toggleFav() {
      if (this.esFavorito) this.REMOVE_FAVORITO(this.ciudad.nombre)
      else this.ADD_FAVORITO(this.ciudad.nombre)
    }
  }
}
</script>

<style scoped>
.place-card {
  position: relative;
  background: rgba(20, 14, 35, 0.88);
  border: 1px solid rgba(233,184,255,0.15);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.place-card:hover {
  transform: translateY(-6px);
  border-color: rgba(233,184,255,0.5);
  box-shadow: 0 0 25px rgba(168,85,247,0.35), 0 0 50px rgba(168,85,247,0.15), 0 20px 40px rgba(0,0,0,0.3);
}
.place-card:hover .card-glow { opacity: 1; }
.card-glow {
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #a855f7, #e9b8ff, #a855f7);
  opacity: 0; transition: opacity 0.3s ease;
}
.place-card__header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px;
  background: rgba(168,85,247,0.1);
  border-bottom: 1px solid rgba(233,184,255,0.08);
  transition: background 0.3s;
}
.place-card:hover .place-card__header { background: rgba(168,85,247,0.18); }
.place-card__title { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #f5f5f5; }
.fav-btn { background: none; color: #e9b8ff; font-size: 1.1rem; padding: 2px 6px; border-radius: 6px; transition: all 0.2s; }
.fav-btn:hover { background: rgba(233,184,255,0.15); transform: scale(1.15); }
.place-card__body {
  padding: 20px 16px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1;
}
.weather-icon { font-size: 2.2rem; color: #e9b8ff; transition: transform 0.3s ease, text-shadow 0.3s ease; }
.place-card:hover .weather-icon { transform: scale(1.15); text-shadow: 0 0 20px rgba(233,184,255,0.7); }
.place-card__temp {
  font-family: 'Nunito', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  color: #e9b8ff;
  line-height: 1;
  transition: text-shadow 0.3s;
  -webkit-background-clip: unset;
  background-clip: unset;
  background: none;
}
.place-card:hover .place-card__temp { text-shadow: 0 0 30px rgba(233,184,255,0.5); }
.place-card__status { color: #a78bfa; font-size: 0.85rem; text-transform: capitalize; }
.card-meta { display: flex; gap: 14px; font-size: 0.75rem; color: #8b8b8b; margin-top: 4px; }
.card-meta i { margin-right: 3px; color: #a855f7; }
.card-loading { padding: 24px 16px; display: flex; flex-direction: column; gap: 10px; align-items: center; min-height: 160px; justify-content: center; }
.sk-icon { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.06); animation: pulse 1.4s infinite; }
.sk-text { width: 80px; height: 16px; border-radius: 6px; background: rgba(255,255,255,0.06); animation: pulse 1.4s infinite; }
.sk-text--sm { width: 55px; height: 12px; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
</style>