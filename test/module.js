import { resolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'
import { wrapModule } from './utils/module.js'

const delay = ms => new Promise(resolve =>
  setTimeout(resolve, ms)
)
global.__dirname = 'lib'

test('Module: adds template and plugin', async (t) => {
  const ctx = wrapModule(Module)
  ctx.Module({})
  await delay(100)
  const tmpl0 = ctx.nuxt.options.build.templates[0]
  const tmpl1 = ctx.nuxt.options.build.templates[1]

  const plugin0 = ctx.nuxt.options.plugins[0]
  t.is(tmpl0.filename, 'nuxt-highcharts.hcMods.js')
  t.true(tmpl0.getContents().length > 0)
  t.is(tmpl1.src, resolve(__dirname, 'components.js'))
  t.is(tmpl1.filename, 'nuxt-highcharts.components.js')

  t.is(plugin0.src, resolve(__dirname, 'plugin.js'))

  ctx.Module({
    exporting: true
  })
  await delay(100)
  t.true(ctx.nuxt.options.publicRuntimeConfig.nuxtHighcharts.pluginOptions.exporting)
})
