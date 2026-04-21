import { createStore } from 'vuex'
import { CIUDADES, obtenerClimaActual, obtenerPronostico, calcularEstadisticas } from '../services/weatherService'

const stored = localStorage.getItem('weather_user')

export default createStore({
  state: {
    // Auth
    usuario: stored ? JSON.parse(stored) : null,
    isAuthenticated: !!stored,
    loadingAuth: false,
    errorAuth: null,

    // Clima
    ciudades: CIUDADES,
    climaActual: {},
    loadingClima: false,
    errorClima: null,

    // Detalle
    ciudadSeleccionada: null,
    pronostico: [],
    estadisticas: null,
    loadingDetalle: false,
    errorDetalle: null,

    // Preferencias
    preferencias: { unidad: 'C' }
  },

  getters: {
    usuario: s => s.usuario,
    isAuthenticated: s => s.isAuthenticated,
    loadingAuth: s => s.loadingAuth,
    errorAuth: s => s.errorAuth,
    ciudades: s => s.ciudades.slice(0, 5),
    climaActual: s => s.climaActual,
    loadingClima: s => s.loadingClima,
    errorClima: s => s.errorClima,
    ciudadSeleccionada: s => s.ciudadSeleccionada,
    pronostico: s => s.pronostico,
    estadisticas: s => s.estadisticas,
    loadingDetalle: s => s.loadingDetalle,
    errorDetalle: s => s.errorDetalle,
    preferencias: s => s.usuario?.preferencias || s.preferencias,
    favoritos: s => s.usuario?.favoritos || []
  },

  mutations: {
    SET_USUARIO(state, usuario) {
      state.usuario = usuario
      state.isAuthenticated = true
      state.errorAuth = null
      localStorage.setItem('weather_user', JSON.stringify(usuario))
    },
    LOGOUT(state) {
      state.usuario = null
      state.isAuthenticated = false
      localStorage.removeItem('weather_user')
    },
    SET_LOADING_AUTH(state, val) { state.loadingAuth = val },
    SET_ERROR_AUTH(state, msg) { state.errorAuth = msg },

    SET_CLIMA_ACTUAL(state, { id, clima }) {
      state.climaActual = { ...state.climaActual, [id]: clima }
    },
    SET_LOADING_CLIMA(state, val) { state.loadingClima = val },
    SET_ERROR_CLIMA(state, msg) { state.errorClima = msg },

    SET_CIUDAD_SELECCIONADA(state, ciudad) { state.ciudadSeleccionada = ciudad },
    SET_PRONOSTICO(state, pronostico) { state.pronostico = pronostico },
    SET_ESTADISTICAS(state, stats) { state.estadisticas = stats },
    SET_LOADING_DETALLE(state, val) { state.loadingDetalle = val },
    SET_ERROR_DETALLE(state, msg) { state.errorDetalle = msg },

    UPDATE_PREFERENCIAS(state, prefs) {
      if (state.usuario) {
        state.usuario.preferencias = { ...state.usuario.preferencias, ...prefs }
        localStorage.setItem('weather_user', JSON.stringify(state.usuario))
      } else {
        state.preferencias = { ...state.preferencias, ...prefs }
      }
    },
    ADD_FAVORITO(state, ciudad) {
      if (state.usuario && !state.usuario.favoritos.includes(ciudad)) {
        state.usuario.favoritos.push(ciudad)
        localStorage.setItem('weather_user', JSON.stringify(state.usuario))
      }
    },
    REMOVE_FAVORITO(state, ciudad) {
      if (state.usuario) {
        state.usuario.favoritos = state.usuario.favoritos.filter(f => f !== ciudad)
        localStorage.setItem('weather_user', JSON.stringify(state.usuario))
      }
    }
  },

  actions: {
    async login({ commit }, { email, password }) {
      commit('SET_LOADING_AUTH', true)
      commit('SET_ERROR_AUTH', null)
      try {
        const { loginMock } = await import('../services/authService')
        const usuario = await loginMock(email, password)
        commit('SET_USUARIO', usuario)
        return true
      } catch (e) {
        commit('SET_ERROR_AUTH', e.message)
        return false
      } finally {
        commit('SET_LOADING_AUTH', false)
      }
    },

    async register({ commit }, { nombre, email, password }) {
      commit('SET_LOADING_AUTH', true)
      commit('SET_ERROR_AUTH', null)
      try {
        const { registerMock } = await import('../services/authService')
        const usuario = await registerMock(nombre, email, password)
        commit('SET_USUARIO', usuario)
        return true
      } catch (e) {
        commit('SET_ERROR_AUTH', e.message)
        return false
      } finally {
        commit('SET_LOADING_AUTH', false)
      }
    },

    logout({ commit }) { commit('LOGOUT') },

    async cargarTodoElClima({ commit, state, getters }) {
      commit('SET_LOADING_CLIMA', true)
      commit('SET_ERROR_CLIMA', null)
      try {
        const unidad = getters.preferencias.unidad === 'F' ? 'imperial' : 'metric'
        const promesas = state.ciudades.map(async ciudad => {
          const clima = await obtenerClimaActual(ciudad.lat, ciudad.lon, unidad)
          commit('SET_CLIMA_ACTUAL', { id: ciudad.id, clima })
        })
        await Promise.all(promesas)
      } catch (e) {
        commit('SET_ERROR_CLIMA', 'No se pudo cargar el clima.')
      } finally {
        commit('SET_LOADING_CLIMA', false)
      }
    },

    async cargarDetalle({ commit, state, getters }, id) {
      commit('SET_LOADING_DETALLE', true)
      commit('SET_ERROR_DETALLE', null)
      try {
        let ciudad = state.ciudades.find(c => c.id === id)
        
        if (!ciudad && id === 0) {
          ciudad = state.ciudadSeleccionada
        }

        if (!ciudad) throw new Error('Ciudad no encontrada')

        commit('SET_CIUDAD_SELECCIONADA', ciudad)
        const unidad = getters.preferencias.unidad === 'F' ? 'imperial' : 'metric'
        
        const climaData = await obtenerClimaActual(ciudad.lat, ciudad.lon, unidad)
        commit('SET_CLIMA_ACTUAL', { id: ciudad.id, clima: climaData })
        
        const pronostico = await obtenerPronostico(ciudad.lat, ciudad.lon, unidad)
        commit('SET_PRONOSTICO', pronostico)
        
        const stats = calcularEstadisticas(pronostico)
        commit('SET_ESTADISTICAS', stats)
      } catch (e) {
        commit('SET_ERROR_DETALLE', 'Error al cargar el detalle.')
      } finally {
        commit('SET_LOADING_DETALLE', false)
      }
    }
  }
})