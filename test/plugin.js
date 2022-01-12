import test from 'ava'
import '../lib/plugin.js'
import { pluginCtx, pluginDef } from './utils/plugin.js'

test('Plugin registers components', async (t) => {
  const nuxtApp = pluginCtx()
  nuxtApp.$config = {
    nuxtHighcharts: {
      pluginOptions: {},
      hcMods: []
    }
  }
  await pluginDef(nuxtApp)
  const ctx = pluginCtx()
  t.truthy(ctx.$highcharts)
  const highcharts = ctx.$highcharts({})
  t.is(typeof highcharts, 'object')

  const expectedComps = ['highchart', 'highstock', 'highmap']

  expectedComps.forEach((c) => {
    t.true(ctx.components.hasOwnProperty(c))
  })
})
