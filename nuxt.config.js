import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  components: {
    global: true,
    dirs: ['~/components']
  },
  telemetry: false,
  css: [
    '~/assets/bootstrap.min.css',
    '~/assets/main.css'
  ],
  modules: [
    '~/lib/module.js'
  ],
  highcharts: {
    exporting: true
  }
})
