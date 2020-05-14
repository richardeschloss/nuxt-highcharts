const { resolve } = require('path')

module.exports = function (moduleOptions) {
  const options = {
    ...this.options['highcharts'],
    ...moduleOptions
  }

  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-highcharts.js',
    options
  })
}

module.exports.meta = require('../package.json')
