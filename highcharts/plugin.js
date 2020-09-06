import Vue from 'vue'
import ComponentFactory from './components'

const pluginOptions = <%= JSON.stringify(options) %>

const CONSTANTS = {
  chartTypes: [
    'Spline',
    'AreaSpline',
    'Line',
    'Scatter',
    'Column',
    'Area'
  ],
  components: [
    { name: 'highchart', variant: 'chart' },
    { name: 'highstock', variant: 'stockChart' },
    { name: 'highmap', variant: 'mapChart' },
    { name: 'sunburst', variant: 'sunburstChart' }
  ]
}

CONSTANTS.variants = CONSTANTS.components.map(({variant}) => variant)

CONSTANTS.components.forEach(({ name, variant }) => {
  Vue.component(name, ComponentFactory(variant, pluginOptions))
})

function $highcharts(instOpts) {
  const svc = {}
  return Object.freeze(svc)
}

Object.entries(CONSTANTS).forEach(([constant, obj]) => {
  Object.defineProperty($highcharts, constant, {
    writable: false,
    value: Object.freeze(obj)
  })
})

export default function(context, inject) {
  inject('highcharts', $highcharts)
}
