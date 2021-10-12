import Vue from 'vue'
import ComponentFactory, { extendProps } from './components.js'

export default function (context, inject) {
  const { pluginOptions, hcMods: hcModNames } = context.$config.nuxtHighcharts
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
    Vue.component(name, ComponentFactory(variant, pluginOptions))
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

  inject('highcharts', $highcharts)
}
