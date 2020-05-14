const { resolve } = require('path')

module.exports = function (moduleOptions) {
  console.log('HIGHCHARTS')
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
