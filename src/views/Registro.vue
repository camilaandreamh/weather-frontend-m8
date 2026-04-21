<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">⛅</div>
      <h1 class="auth-title">Crear cuenta</h1>
      <p class="auth-sub">Empieza a guardar tus ciudades favoritas</p>
      <div v-if="errorAuth" class="alert-error">⚠ {{ errorAuth }}</div>
      <form class="auth-form" @submit.prevent="handleRegistro">
        <div class="field"><label>Nombre completo</label><input v-model="form.nombre" type="text" placeholder="Tu nombre" required /></div>
        <div class="field"><label>Email</label><input v-model="form.email" type="email" placeholder="tu@email.com" required /></div>
        <div class="field"><label>Contraseña</label><input v-model="form.password" type="password" placeholder="Mínimo 4 caracteres" minlength="4" required /></div>
        <div class="field"><label>Confirmar contraseña</label><input v-model="form.confirmPassword" type="password" placeholder="Repite tu contraseña" required /></div>
        <div v-if="errorLocal" class="alert-error">{{ errorLocal }}</div>
        <button type="submit" class="btn-submit" :disabled="loadingAuth">
          <span v-if="loadingAuth" class="spinner-sm"></span>
          {{ loadingAuth ? 'Creando...' : 'Crear cuenta' }}
        </button>
      </form>
      <p class="auth-footer">¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Registro',
  data() { return { form: { nombre: '', email: '', password: '', confirmPassword: '' }, errorLocal: null } },
  computed: { ...mapGetters(['loadingAuth', 'errorAuth', 'isAuthenticated']) },
  mounted() { if (this.isAuthenticated) this.$router.push('/') },
  methods: {
    ...mapActions(['register']),
    async handleRegistro() {
      this.errorLocal = null
      if (this.form.password !== this.form.confirmPassword) { this.errorLocal = 'Las contraseñas no coinciden.'; return }
      const ok = await this.register({ nombre: this.form.nombre, email: this.form.email, password: this.form.password })
      if (ok) this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 32px 16px; }
.auth-card { width: min(500px, 100%); background: var(--surface); border-radius: 28px; padding: 40px 36px; border: 1px solid var(--border2); box-shadow: var(--shadow); }
.auth-logo { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px; background: rgba(240,180,41,0.12); font-size: 1.6rem; margin-bottom: 20px; }
.auth-title { font-size: 1.8rem; margin-bottom: 8px; }
.auth-sub { color: var(--text2); margin-bottom: 22px; font-size: 0.9rem; }
.alert-error { margin-bottom: 16px; padding: 12px 16px; border-radius: var(--radius-sm); background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); color: var(--error); font-size: 0.88rem; }
.auth-form { display: grid; gap: 16px; }
.field label { display: block; margin-bottom: 7px; color: var(--text2); font-size: 0.88rem; }
input { width: 100%; }
.btn-submit { width: 100%; padding: 14px; border-radius: var(--radius-sm); background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s; }
.btn-submit:hover:not(:disabled) { opacity: 0.9; }
.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }
.spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.auth-footer { margin-top: 18px; color: var(--text2); font-size: 0.88rem; text-align: center; }
.auth-footer a { color: var(--primary); font-weight: 600; }
</style>
