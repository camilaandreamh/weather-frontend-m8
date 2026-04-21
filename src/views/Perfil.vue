<template>
  <div class="perfil">
    <div class="page-header">
      <div class="avatar">{{ iniciales }}</div>
      <div>
        <h1>{{ usuario.nombre }}</h1>
        <p class="page-sub">{{ usuario.email }}</p>
      </div>
    </div>

    <div class="sections">
      <div class="section-card">
        <h2>Preferencias de clima</h2>
        <p class="section-desc">Personaliza cómo se muestra la información.</p>
        <div class="pref-group">
          <div class="pref-label">Unidad de temperatura</div>
          <div class="toggle-row">
            <button class="toggle-btn" :class="{ active: preferencias.unidad === 'C' }" @click="cambiarUnidad('C')">°C Celsius</button>
            <button class="toggle-btn" :class="{ active: preferencias.unidad === 'F' }" @click="cambiarUnidad('F')">°F Fahrenheit</button>
          </div>
        </div>
        <div class="preview-box">
          <span class="prev-icon">🌡️</span>
          <div>
            <div class="prev-label">Ejemplo con tu unidad actual</div>
            <div class="prev-temp">{{ ejemploTemp }}</div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <h2>Resumen de cuenta</h2>
        <div class="stat-row">
          <div class="stat">
            <span class="stat-value">{{ favoritos.length }}</span>
            <span class="stat-label">Ciudades favoritas</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ preferencias.unidad }}</span>
            <span class="stat-label">Unidad activa</span>
          </div>
        </div>
        <button class="btn-logout-full" @click="handleLogout">Cerrar sesión</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Perfil',
  computed: {
    ...mapGetters(['usuario', 'preferencias', 'favoritos']),
    iniciales() {
      return this.usuario.nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    },
    ejemploTemp() {
      const base = 22
      if (this.preferencias.unidad === 'F') return `${Math.round(base * 9/5 + 32)}°F`
      return `${base}°C`
    }
  },
  methods: {
    ...mapActions(['logout']),
    ...mapMutations(['UPDATE_PREFERENCIAS']),
    cambiarUnidad(unidad) { this.UPDATE_PREFERENCIAS({ unidad }) },
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.perfil { display: flex; flex-direction: column; gap: 28px; max-width: 900px; }
.page-header {
  display: flex; align-items: center; gap: 18px;
  padding: 24px 28px; border-radius: var(--radius);
  background: rgba(124,58,237,0.08);
  border: 1px solid rgba(240,180,41,0.1);
}
.avatar {
  width: 68px; height: 68px; border-radius: 20px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #0a0a0a; display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 1.2rem;
}
.page-header h1 { font-size: 1.8rem; margin-bottom: 4px; }
.page-sub { color: var(--text2); font-size: 0.9rem; }
.sections { display: grid; gap: 20px; }
.section-card {
  padding: 26px; background: var(--surface);
  border-radius: var(--radius); border: 1px solid var(--border2);
  box-shadow: var(--shadow);
}
.section-card h2 { font-size: 1.1rem; margin-bottom: 6px; }
.section-desc { color: var(--text2); margin-bottom: 20px; font-size: 0.88rem; }
.pref-group { display: grid; gap: 14px; }
.pref-label { color: var(--text2); font-size: 0.88rem; font-weight: 600; }
.toggle-row { display: flex; gap: 12px; }
.toggle-btn {
  flex: 1; padding: 14px; border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.05); border: 1px solid var(--border2);
  color: var(--text); font-weight: 600; transition: all 0.2s;
}
.toggle-btn:hover { background: rgba(240,180,41,0.1); }
.toggle-btn.active {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-color: transparent; color: #0a0a0a;
}
.preview-box {
  display: flex; align-items: center; gap: 16px; margin-top: 18px;
  padding: 18px; border-radius: var(--radius-sm);
  background: rgba(124,58,237,0.08); border: 1px solid rgba(240,180,41,0.1);
}
.prev-icon {
  width: 52px; height: 52px; display: grid; place-items: center;
  border-radius: 14px; background: rgba(240,180,41,0.12); font-size: 1.3rem;
}
.prev-label { color: var(--text2); font-size: 0.82rem; margin-bottom: 4px; }
.prev-temp { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 800; color: var(--primary); }
.stat-row { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; margin: 18px 0; }
.stat {
  padding: 16px; border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.04); border: 1px solid var(--border);
}
.stat-value { display: block; font-size: 1.8rem; font-weight: 800; color: var(--text); }
.stat-label { color: var(--text2); font-size: 0.82rem; margin-top: 4px; display: block; }
.btn-logout-full {
  width: 100%; padding: 14px; border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #0a0a0a; font-weight: 700; font-size: 0.95rem;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-logout-full:hover { opacity: 0.9; transform: translateY(-1px); }
</style>
