<template>
  <div>
    <highmap
      :map="mapChart"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import USMapData from '@highcharts/map-collection/countries/us/custom/us-small.geo.json'
// To address highcharts error 21:
import proj4 from 'https://cdn.jsdelivr.net/npm/proj4@2.7.5/+esm'

if (typeof window !== 'undefined') {
  window.proj4 = window.proj4 || proj4
}
//

export default {
  data () {
    return {
      codes: [],
      mapChart: {
        mapName: 'us-small',
        mapData: USMapData
      }
    }
  },
  computed: {
    chartOptions () {
      return {
        chart: {
          map: 'us-small',
          borderWidth: 1
        },

        title: {
          text: 'US population density (/km²)'
        },

        exporting: {
          sourceWidth: 600,
          sourceHeight: 500
        },

        legend: {
          layout: 'horizontal',
          borderWidth: 0,
          backgroundColor: 'rgba(255,255,255,0.85)',
          floating: true,
          verticalAlign: 'top',
          y: 25
        },

        mapNavigation: {
          enabled: true
        },

        colorAxis: {
          min: 1,
          type: 'logarithmic',
          minColor: '#EEEEFF',
          maxColor: '#000022',
          stops: [
            [0, '#EFEFFF'],
            [0.67, '#4444FF'],
            [1, '#000022']
          ]
        },

        series: [{
          accessibility: {
            point: {
              valueDescriptionFormat: '{xDescription}, {point.value} people per square kilometer.'
            }
          },
          animation: {
            duration: 1000
          },
          data: this.codes, // data,
          joinBy: ['postal-code', 'code'],
          dataLabels: {
            enabled: true,
            color: '#FFFFFF',
            format: '{point.code}'
          },
          name: 'Population density',
          tooltip: {
            pointFormat: '{point.code}: {point.value}/km²'
          }
        }]
      }
    }
  },
  async mounted () {
    this.codes = (await fetch('/us-population-density.json')
      .then(res => res.json()))
      .map((p) => {
        p.code = p.code.toUpperCase()
        return p
      })
  }
}
</script>

<style lang="scss" scoped>

</style>
