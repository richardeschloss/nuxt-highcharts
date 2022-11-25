import ComponentFactory, { extendProps } from './components.js'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const { pluginOptions, hcMods: hcModNames } = nuxtApp.$config.public.nuxtHighcharts
  extendProps(hcModNames)

  const CONSTANTS = {
    chartTypes: [
      'Spline',
      'AreaSpline',
      'Line',
      'Scatter',
      'Column',
      'Area'
    ],
    // The highcharts constructor needs these
    // specific variant names
    components: [
      { name: 'highchart', variant: 'chart' },
      { name: 'highstock', variant: 'stockChart' },
      { name: 'highmap', variant: 'mapChart' }
    ]
  }

  CONSTANTS.components.forEach(({ name, variant }) => {
    nuxtApp.vueApp.component(name, ComponentFactory(variant, pluginOptions))
  })

  function $highcharts (instOpts) {
    const svc = {}
    return Object.freeze(svc)
  }

  Object.entries(CONSTANTS).forEach(([constant, obj]) => {
    Object.defineProperty($highcharts, constant, {
      writable: false,
      value: Object.freeze(obj)
    })
  })

  nuxtApp.provide('highcharts', $highcharts)
})
