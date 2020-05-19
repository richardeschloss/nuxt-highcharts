<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand to="/" class="logos">
        <img src="@/assets/highcharts_logo.png" width="75%" alt="Highcharts Logo" />
        <img src="@/assets/nuxt.svg" width="18%"/>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav right>
        <b-navbar-nav class="ml-auto" right>
          <b-nav-item v-for="link in links" :key="link.to" :to="link.to" right>{{link.label}}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <h2>Welcome to the Nuxt Highcharts Demo!</h2>
    <hr style="width: 200px; margin: 30px auto;">
  </div>
</template>

<script>
function startCase(str) {
  return str
    .replace(/[a-z]/, (val) => val.toUpperCase() )
    .replace(/[a-z][A-Z]/, (val) => val.split('').join(' '))
}
export default {
  data() {
    return {
      links: []
    }
  },
  mounted() {
    this.links = this.$highcharts.variants.map((v) => ({
      to: v,
      label: startCase(v)
    }))
  }
}
</script>

<style scoped>
.logos {
  width:50%;
}
</style>