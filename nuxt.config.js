/** @type {import('highcharts/highcharts').Options} */ 
const setOptions = { 
  lang: { // <-- we correctly get intellisense
    // decimalPoint: '.' // this can be changed to anything, like ',' and it works
  }
}

/** @type {import('highcharts/highcharts').Options} */
const chartOptions = { // <-- we also get intellisense correctly. 
  credits: {
    enabled: true // <-- typing "e" suggests "enabled?" ok
  }
}
// Important note: as of 12/2020 it seems...
// per the API docs, the "setOptions" get passed to the "Highcharts.setOptions" method
// while the chartOptions would get passed to the *Highcharts.chart* method

module.exports = {
  telemetry: false,
  env: {},
  ssr: true,
  /*
   ** Headers of the page
   */
  head: {
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
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  /*
   ** Nuxt.js modules
   */
  modules: [
    'bootstrap-vue/nuxt',
    '~/highcharts/module.js',
    'nuxt-socket-io'
  ],
  io: {
    sockets: [{
      name: 'main',
      url: process.env.NODE_ENV === 'production' 
        ? process.env.IO_HOST_PROD
        : process.env.IO_HOST_DEV

    }]
  },
  highcharts: {
    exporting: true,
    setOptions
    // mapChart: { // Also works
    //   mapName: 'myMapName',
    //   mapData: {importedjsonData...} 
    // }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    parallel: true,
    cache: true,
    hardSource: true
  },
  globals: {
    loadingTimeout: 5000
  },
  generate: {
    dir: './public'
  }
}
