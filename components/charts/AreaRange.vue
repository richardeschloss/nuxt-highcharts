<template>
  <div>
    <highchart :options="chartOpts" more />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
const data = ref([])
fetch('/arearange.json').then(res => res.json())
  .then((json) => {
    data.value = json
  })
const chartOpts = reactive({
  accessibility: {
    enabled: false
  },

  chart: {
    type: 'arearange',
    zoomType: 'x',
    scrollablePlotArea: {
      minWidth: 600,
      scrollPositionX: 1
    }
  },

  title: {
    text: 'Temperature variation by day'
  },

  xAxis: {
    type: 'datetime',
    accessibility: {
      rangeDescription: 'Range: Jan 1st 2017 to Dec 31 2017.'
    }
  },

  yAxis: {
    title: {
      text: null
    }
  },

  tooltip: {
    crosshairs: true,
    shared: true,
    valueSuffix: '°C',
    xDateFormat: '%A, %b %e'
  },

  legend: {
    enabled: false
  },

  series: [{
    name: 'Temperatures',
    data
  }]
})
</script>
