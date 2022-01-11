import { readdirSync } from 'fs'
import { resolve } from 'path'
import { defineNuxtModule, addPlugin, addTemplate } from '@nuxt/kit'

/**
 * This will let us map aliases to highcharts modules
 * (vite will need this to statically analyze the imports)
 * i.e., it can't analyze import(`highcharts/modules/${modName}.js`)
 */
const hcModDir = './node_modules/highcharts/modules'
let fns = 'export default {\r\n'
const hcMods = readdirSync(hcModDir)
  .filter(f => f.endsWith('.js') && !f.endsWith('.src.js'))
  .map((f) => {
    const mod = f.replace(/.js$/, '')
    fns += `'${mod}': () => import('highcharts/modules/${f}'),\r\n`
    return mod
  })
fns += '}'

function includeDeps(nuxt, deps) {
  if (!nuxt.options.vite.optimizeDeps) {
    nuxt.options.vite.optimizeDeps = {}
  }
  if (!nuxt.options.vite.optimizeDeps.include) {
    nuxt.options.vite.optimizeDeps.include = []
  }
  nuxt.options.vite.optimizeDeps.include.push(...deps)
}

/**
 *
 * @param {*} moduleOptions
 */
export default defineNuxtModule({
  setup (moduleOptions, nuxt) {
    const options = {
      ...nuxt.options.highcharts,
      ...moduleOptions
    }
    includeDeps(nuxt, ['highcharts'])

    nuxt.options.build.transpile.push(__dirname)
    nuxt.options.publicRuntimeConfig.nuxtHighcharts = {
      pluginOptions: options,
      hcMods
    }

    // TBD: Nuxt3
    // To use, import hcMods from '#build/nuxt-highcharts.hcMods.js'
    // Lazy import:
    // const importedMod = await hcMods[modName]() ... will import
    addTemplate({
      filename: 'nuxt-highcharts.hcMods.js',
      getContents: () => fns
    })

    addTemplate({
      src: resolve(__dirname, 'components.js'),
      filename: 'nuxt-highcharts.components.js'
    })

    addPlugin({
      ssr: false,
      src: resolve(__dirname, 'plugin.js')
    })
  }
})
