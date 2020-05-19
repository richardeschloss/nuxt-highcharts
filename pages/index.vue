<template>
  <div id="app">
    <navbar />
    <client-only>
      <nuxt-child />
    </client-only>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  /* margin-top: 60px;*/
  width: 70%; 
}

h1, h2 {
  font-weight: normal;
}
</style>
