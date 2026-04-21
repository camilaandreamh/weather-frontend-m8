<template>
  <nav class="navbar">
    <router-link to="/" class="brand">
      <span class="brand-icon">⛅</span>
      <span class="brand-name">Clima <strong>Click</strong></span>
    </router-link>

    <div class="nav-links">
      <router-link to="/" class="nav-link">Inicio</router-link>
      <template v-if="isAuthenticated">
        <router-link to="/favoritos" class="nav-link">Favoritos</router-link>
        <router-link to="/perfil" class="nav-link">Perfil</router-link>
      </template>
    </div>

    <div class="nav-auth">
      <template v-if="isAuthenticated">
        <span class="user-chip">
          <span class="user-dot"></span>
          {{ usuario.nombre.split(' ')[0] }}
        </span>
        <button class="btn-logout" @click="handleLogout">Salir</button>
      </template>
      <template v-else>
        <router-link to="/login" class="btn-login">Iniciar sesión</router-link>
        <router-link to="/registro" class="btn-register">Registrarse</router-link>
      </template>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['isAuthenticated', 'usuario'])
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 16px;
  z-index: 100;
  margin: 16px auto;
  max-width: 1100px;
  width: calc(100% - 32px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-radius: 24px;
  background: rgba(12, 8, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border2);
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}

.brand { display: flex; align-items: center; gap: 10px; }
.brand-icon { font-size: 1.3rem; }
.brand-name { font-weight: 700; font-size: 1.05rem; letter-spacing: -0.02em; }
.brand-name strong { color: var(--primary); }

.nav-links { display: flex; gap: 4px; }

.nav-link {
  color: var(--text2);
  padding: 8px 14px;
  border-radius: var(--radius-xs);
  font-size: 0.9rem;
  transition: all 0.2s;
}
.nav-link:hover, .nav-link.router-link-active {
  background: rgba(124,58,237,0.15);
  color: var(--text);
}

.nav-auth { display: flex; align-items: center; gap: 8px; }

.btn-login {
  padding: 9px 16px;
  border-radius: var(--radius-xs);
  color: var(--text2);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  font-size: 0.88rem;
  transition: all 0.2s;
}
.btn-login:hover { background: rgba(255,255,255,0.08); color: var(--text); }

.btn-register {
  padding: 9px 16px;
  border-radius: var(--radius-xs);
  background: var(--secondary);
  color: white;
  font-weight: 600;
  font-size: 0.88rem;
  transition: opacity 0.2s;
}
.btn-register:hover { opacity: 0.88; }

.btn-logout {
  padding: 9px 16px;
  border-radius: var(--radius-xs);
  color: var(--text2);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  font-size: 0.88rem;
  transition: all 0.2s;
}
.btn-logout:hover { background: rgba(244,63,94,0.12); color: var(--error); border-color: rgba(244,63,94,0.2); }

.user-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: var(--radius-xs);
  background: rgba(124,58,237,0.15);
  border: 1px solid rgba(124,58,237,0.2);
  font-size: 0.88rem;
}
.user-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); }

@media (max-width: 720px) {
  .navbar { flex-wrap: wrap; }
  .nav-links { order: 3; width: 100%; justify-content: center; }
}
</style>
