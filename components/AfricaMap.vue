<template>
  <div>
    Africa...
    <input
      v-model="title"
      class="form-control centered"
    >
    <highmap 
      :options="chartOptions" 
      :update="watchers" 
    />
  </div>
</template>

<script>
// import AfricaMapData from '@highcharts/map-collection/custom/africa.geo.json'
// console.log('africa', AfricaMapData)

// Create the chart
export default {
  data() {
    return {
      title: 'Highmaps basic demo',
      // mapChart: {
      //   mapName: 'africa',
      //   mapData: AfricaMapData
      // },
      watchers: ['options.title']
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          map: 'myMapName'
        },
        title: {
          text: this.title
        },
        subtitle: {
          text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            alignTo: 'spacingBox'
          }
        },
        colorAxis: {
          min: 0
        },
        series: [{
          name: 'Random data',
          states: {
            hover: {
              color: '#BADA55'
            }
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          },
          allAreas: false,
          data: [
            ['ug', 0],
            ['ng', 1],
            ['st', 2],
            ['tz', 3],
            ['sl', 4],
            ['gw', 5],
            ['cv', 6],
            ['sc', 7],
            ['tn', 8],
            ['mg', 9],
            ['ke', 10],
            ['cd', 11],
            ['fr', 12],
            ['mr', 13],
            ['dz', 14],
            ['er', 15],
            ['gq', 16],
            ['mu', 17],
            ['sn', 18],
            ['km', 19],
            ['et', 20],
            ['ci', 21],
            ['gh', 22],
            ['zm', 23],
            ['na', 24],
            ['rw', 25],
            ['sx', 26],
            ['so', 27],
            ['cm', 28],
            ['cg', 29],
            ['eh', 30],
            ['bj', 31],
            ['bf', 32],
            ['tg', 33],
            ['ne', 34],
            ['ly', 35],
            ['lr', 36],
            ['mw', 37],
            ['gm', 38],
            ['td', 39],
            ['ga', 40],
            ['dj', 41],
            ['bi', 42],
            ['ao', 43],
            ['gn', 44],
            ['zw', 45],
            ['za', 46],
            ['mz', 47],
            ['sz', 48],
            ['ml', 49],
            ['bw', 50],
            ['sd', 51],
            ['ma', 52],
            ['eg', 53],
            ['ls', 54],
            ['ss', 55],
            ['cf', 56]
          ]
        }]
      }
    }
  }  
}
</script>
 <style scoped>
 </style>
