<template>
  <div id="app-root">
    <Navbar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: { Navbar }
}
</script>

<style>

body, #app {
  background-color: #120129; 
  color: white;
  margin: 0;
  /* Forzamos la tipografía limpia en todo el documento */
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; 
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
  background: radial-gradient(circle at center, #2e0261 0%, #120129 100%);
  padding: 20px;
  /* CAMBIO: Alineamos a la izquierda pero con un espacio (padding) */
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
}

/* 2. TÍTULOS (CON TENDENCIA IZQUIERDA) */
h1, .titulo-app {
  font-weight: 300; 
  font-size: 2rem;
  text-align: left; /* Alineado a la izquierda */
  background: linear-gradient(180deg, #ff9aed 0%, #c86bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-left: 10px; /* Un pequeño respiro del borde */
  margin-bottom: 25px;
}

/* 3. LA TARJETA (ALINEADA A LA IZQUIERDA PERO NO PEGADA) */
.card-glass {
  background: rgba(255, 255, 255, 0.03); 
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 154, 237, 0.15);
  border-radius: 15px; 
  padding: 20px; 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  /* CAMBIO: Se queda a la izquierda con un margen pequeño */
  margin: 10px 0 10px 10px; 
  width: 85%;
  max-width: 380px; 
  
  /* Aseguramos que dentro de la tarjeta el texto sea sans-serif */
  text-align: left;
}


.card-glass *, .temperatura-card, span, p, h2 {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  font-variant-numeric: tabular-nums; /* Para que los números se vean ordenados */
}

.temperatura-card {
  font-size: 2.8rem; 
  font-weight: 200;
  display: block;
  background: linear-gradient(180deg, #ffffff 0%, #ff9aed 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>