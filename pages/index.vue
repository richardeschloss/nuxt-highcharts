<template>
  <div id="app">
    <Navbar :charts="charts" @chartSelected="(chart) => selectedChart = chart" />
    <component :is="selectedChart.name" />
  </div>
</template>

<script>
export default {
  data () {
    const charts = []
    for (const c in this.$options.components) {
      if (c.startsWith('Charts')) {
        charts.push({
          name: c,
          displayName: c.replace('Charts', ''),
          component: this.$options.components[c]
        })
      }
    }
    return {
      selectedChart: '',
      charts
    }
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
  /* margin-top: 60px; */
  width: 70%;
}

h1, h2 {
  font-weight: normal;
}
</style>
