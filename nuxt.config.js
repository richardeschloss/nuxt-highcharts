import { defineNuxtConfig } from 'nuxt3'

/** @type {import('highcharts/highcharts').Options} */
const setOptions = {
  lang: { // <-- we correctly get intellisense
    // decimalPoint: '.' // this can be changed to anything, like ',' and it works
  }
}

/** @type {import('highcharts/highcharts').Options} */
// const chartOptions = { // <-- we also get intellisense correctly.
//   credits: {
//     enabled: true // <-- typing "e" suggests "enabled?" ok
//   }
// }
// Important note: as of 12/2020 it seems...
// per the API docs, the "setOptions" get passed to the "Highcharts.setOptions" method
// while the chartOptions would get passed to the *Highcharts.chart* method

export default defineNuxtConfig({
  components: false,
  telemetry: false,
  target: process.env.NODE_ENV === 'development' ? 'server' : 'static',
  head: {
    components: true,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  css: [
    '~/assets/bootstrap.min.css',
    '~/assets/main.css'
  ],
  modules: [
    '~/lib/module.js'
  ],
  highcharts: {
    exporting: true,
    setOptions
    // mapChart: { // Also works
    //   mapName: 'myMapName',
    //   mapData: {importedjsonData...}
    // }
  }
})
