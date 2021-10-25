<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand logos" href="/">
        <img src="@/assets/highcharts_logo.png" width="75%" alt="Highcharts Logo">
        <img src="@/assets/nuxt.svg" width="18%">
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarLinks"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div id="navbarLinks" class="collapse navbar-collapse">
        <form class="position-absolute" style="right: 0px;">
          <select v-model="selectedChart" class="form-control text-center" @change="$emit('chartSelected', selectedChart)">
            <option value="" disabled selected>
              Select Chart
            </option>
            <option v-for="chart in charts" :key="chart.name" :value="chart">
              {{ chart.displayName }}
            </option>
          </select>
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    charts: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectedChart: ''
    }
  }
}
</script>

<style scoped>
.logos {
  width: 25%;
}
</style>
