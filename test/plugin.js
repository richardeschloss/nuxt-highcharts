import test from 'ava'
import { setup } from '#app'

const nuxt = {
  $config: {
    nuxtHighcharts: {
      pluginOptions: {},
      hcMods: []
    }
  },
  provide (name, svc) {
    nuxt['$' + name] = svc
  },
  vueApp: {
    components: [],
    component (name, comp) {
      nuxt.vueApp.components.push(name)
    }
  }
}

test('Plugin registers components', async (t) => {
  setup(nuxt)
  await import('../lib/plugin.js')
  t.truthy(nuxt.$highcharts)
  const highcharts = nuxt.$highcharts({})
  t.is(typeof highcharts, 'object')

  const expectedComps = ['highchart', 'highstock', 'highmap']

  expectedComps.forEach((c) => {
    t.true(nuxt.vueApp.components.includes(c))
  })
})
