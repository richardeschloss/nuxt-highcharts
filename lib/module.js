import { readdirSync } from 'fs'
import { resolve } from 'path'

/**
 * This will let us map aliases to highcharts modules
 * (vite will need this to statically analyze the imports)
 * i.e., it can't analyze import(`highcharts/modules/${modName}.js`)
 */
const hcModDir = './node_modules/highcharts/modules'
// let fns = 'export default {\r\n'
const hcMods = readdirSync(hcModDir)
  .filter(f => f.endsWith('.js') && !f.endsWith('.src.js'))
  .map((f) => {
    const mod = f.replace(/.js$/, '')
    // fns += `'${mod}': () => import('highcharts/modules/${f}'),\r\n`
    return mod
  })
// fns += '}'

/**
 *
 * @param {*} moduleOptions
 */
export default function (moduleOptions) {
  const options = {
    ...this.options.highcharts,
    ...moduleOptions
  }

  this.options.publicRuntimeConfig.nuxtHighcharts = {
    pluginOptions: options,
    hcMods
  }

  // TBD: Nuxt3
  // To use, import hcMods from '#build/nuxt-highcharts.hcMods.js'
  // Lazy import:
  // const importedMod = await hcMods[modName]() ... will import
  // addTemplate({
  //   filename: 'nuxt-highcharts.hcMods.js',
  //   getContents: () => fns
  // })

  this.addTemplate({
    src: resolve(__dirname, 'components.js'),
    fileName: 'nuxt-highcharts/components.js'
  })

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-highcharts/plugin.js',
    options
  })
}
