module.exports = {
  env: {},
  mode: 'spa', // 'universal', // TBD: use highcharts *src* for ssr mode?
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
  buildModules: [],
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
