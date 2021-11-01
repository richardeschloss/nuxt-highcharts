import { resolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'

global.__dirname = 'lib'

test('Module: adds template and plugin', (t) => {
  const ctx = {
    nuxt: {
      version: '3.00',
      hook () {},
      options: {
        plugins: [],
        build: {
          templates: [],
          transpile: []
        },
        publicRuntimeConfig: {}
      }
    },
    /**
     * @param {any} tmpl
     */
    addTemplate (tmpl) {
      ctx.nuxt.options.build.templates.push(tmpl)
    },
    /**
     * @param {any} plugin
     */
    addPlugin (plugin) {
      ctx.nuxt.options.plugins.push(plugin)
    },
    Module
  }
  ctx.Module({})
  const tmpl0 = ctx.nuxt.options.build.templates[0]
  const tmpl1 = ctx.nuxt.options.build.templates[1]

  const plugin0 = ctx.nuxt.options.plugins[0]
  t.is(tmpl0.filename, 'nuxt-highcharts.hcMods.js')
  t.true(tmpl0.getContents().length > 0)
  t.is(tmpl1.src, resolve(__dirname, 'components.js'))
  t.is(tmpl1.filename, 'nuxt-highcharts.components.js')

  t.is(plugin0.src, resolve(__dirname, 'plugin.js'))
  t.false(plugin0.ssr)
})
