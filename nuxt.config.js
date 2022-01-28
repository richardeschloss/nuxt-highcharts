import { defineNuxtConfig } from 'nuxt3'

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
    exporting: true
  }
})
