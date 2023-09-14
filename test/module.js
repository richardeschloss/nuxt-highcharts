import { resolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'
import { initNuxt, useNuxt } from './utils/module.js'

global.__dirname = 'lib'

test('Module: adds template and plugin', async (t) => {
  initNuxt()
  await Module({}, useNuxt())
  const nuxt = useNuxt()
  const tmpl0 = nuxt.options.build.templates[0]
  const tmpl1 = nuxt.options.build.templates[1]

  const plugin0 = nuxt.options.plugins[0]
  t.is(tmpl0.filename, 'nuxt-highcharts.hcMods.js')
  t.true(tmpl0.getContents().length > 0)
  t.is(tmpl1.src, resolve(__dirname, 'components.js'))
  t.is(tmpl1.filename, 'nuxt-highcharts.components.js')
  t.is(resolve(plugin0.src), resolve(__dirname, 'plugin.js'))
  t.is(nuxt.options.vite.optimizeDeps.include[0], 'highcharts')
})
