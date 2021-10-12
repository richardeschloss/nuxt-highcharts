import { resolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'

global.__dirname = '/path/to/lib'

test('Module: adds template and plugin', (t) => {
  const ctx = {
    options: {
      plugins: [],
      build: {
        templates: [],
        transpile: []
      },
      publicRuntimeConfig: {}
    },
    addTemplate (tmpl) {
      ctx.options.build.templates.push(tmpl)
    },
    addPlugin (plugin) {
      ctx.options.plugins.push(plugin)
    },
    Module
  }
  ctx.Module({})
  const tmpl0 = ctx.options.build.templates[0]
  const plugin0 = ctx.options.plugins[0]
  t.is(tmpl0.src, resolve(__dirname, 'components.js'))
  t.is(tmpl0.fileName, 'nuxt-highcharts/components.js')

  t.is(plugin0.src, resolve(__dirname, 'plugin.js'))
  t.is(plugin0.fileName, 'nuxt-highcharts/plugin.js')
})
