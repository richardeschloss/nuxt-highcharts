import test from 'ava'
import { resolve as pResolve } from 'path'
import { getModuleOptions, ModuleContext, PluginContext } from 'nuxt-test-utils'
import config from '@/nuxt.config'
import Module from '@/highcharts/module'

let pOptions, Plugin

test('Module: adds plugin with configured options', async (t) => {
  const tmpFile = pResolve('./highcharts/plugin.compiled.js')
  const moduleOpts = getModuleOptions(config, 'highcharts')
  const ctx = new ModuleContext({
    options: moduleOpts,
    module: Module,
    compileOpts: {
      src: pResolve('./highcharts/plugin.js'),
      tmpFile,
      overwrite: true
    }
  })
  ctx.registerModule()
  t.truthy(ctx.pluginAdded)
  t.false(ctx.pluginAdded.ssr)
  t.is(ctx.pluginAdded.src, pResolve('./highcharts/plugin.js'))
  t.is(ctx.pluginAdded.fileName, 'nuxt-highcharts/plugin.js')
  t.truthy(ctx.pluginAdded.options)

  t.truthy(ctx.templateAdded)
  t.is(ctx.templateAdded.src, pResolve('./highcharts/components.js'))
  t.is(ctx.templateAdded.fileName, 'nuxt-highcharts/components.js')

  const { default: _Plugin, pOptions: _pOptions} = await import(tmpFile)
  pOptions = _pOptions
  Plugin = _Plugin
})

test('Plugin', (t) => {
  const ctx = new PluginContext(Plugin)
  t.truthy(ctx.injected)
  t.truthy(ctx.injected['highcharts'])
  const $highcharts = ctx.injected['highcharts']
  t.truthy($highcharts.chartTypes) 
  t.truthy($highcharts.components)
  t.truthy($highcharts.variants)
  
  const instance = $highcharts({})
  t.is(typeof instance, 'object')
})