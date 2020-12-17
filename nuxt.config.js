/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/** @type {import('highcharts/highcharts').Options} */
const setOptions = {
  lang: {
    // <-- we correctly get intellisense
    // decimalPoint: '.' // this can be changed to anything, like ',' and it works
  }
};

/** @type {import('highcharts/highcharts').Options} */
const chartOptions = {
  // <-- we also get intellisense correctly.
  credits: {
    enabled: true // <-- typing "e" suggests "enabled?" ok
  }
};
// Important note: as of 12/2020 it seems...
// per the API docs, the "setOptions" get passed to the "Highcharts.setOptions" method
// while the chartOptions would get passed to the *Highcharts.chart* method

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "highcharts",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  // target: 'static', // comment out for static else it will be SSR
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~/assets/main.css"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build"
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    "bootstrap-vue/nuxt",
    "~/highcharts/module.js",
    "nuxt-socket-io"
  ],
  io: {
    sockets: [
      {
        name: "main",
        url:
          process.env.NODE_ENV === "production"
            ? process.env.IO_HOST_PROD
            : process.env.IO_HOST_DEV
      }
    ]
  },
  highcharts: {
    exporting: true,
    setOptions
    // mapChart: { // Also works
    //   mapName: 'myMapName',
    //   mapData: {importedjsonData...}
    // }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, ctx) {},
    parallel: true,
    cache: true,
    hardSource: true
  },
  globals: {
    loadingTimeout: 5000
  },
  generate: {
    dir: "./public"
  }
};
