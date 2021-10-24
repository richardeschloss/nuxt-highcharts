import test from 'ava'
import Vue from 'vue'
import Plugin from '../lib/plugin.js'

test('Plugin registers components', (t) => {
  const ctx = {
    $config: {
      nuxtHighcharts: {
        pluginOptions: {},
        hcMods: []
      }
    },
    /**
     *
     * @param {string} label
     * @param {*} obj
     */
    inject (label, obj) {
      ctx['$' + label] = obj
    }
  }
  Plugin(ctx, ctx.inject)
  t.truthy(ctx.$highcharts)
  const highcharts = ctx.$highcharts({})
  t.is(typeof highcharts, 'object')

  const expectedComps = ['highchart', 'highstock', 'highmap']

  expectedComps.forEach((c) => {
    t.truthy(Vue.component(c))
  })
})
