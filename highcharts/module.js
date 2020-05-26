const { resolve } = require('path')

module.exports = function (moduleOptions) {
  const options = {
    ...this.options['highcharts'],
    ...moduleOptions
  }

  this.addTemplate({
    src: resolve(__dirname, 'components.js'),
    fileName: 'nuxt-highcharts/components.js'
  })

  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-highcharts/plugin.js',
    options
  })
}

module.exports.meta = require('../package.json')
