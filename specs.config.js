export default {
  require: ['@babel/register'],
  serial: true,
  files: [
    'test/module.spec.js'
    // 'test/plugin.spec.js'
  ],
  ignoredByWatcher: ['highcharts/plugin.compiled.js'],
  babel: {
    testOptions: {
      plugins: [
        [
          'module-resolver',
          {
            root: ['.'],
            alias: {
              '@': '.',
              '~': '.'
            }
          }
        ]
      ]
    }
  },
  tap: false, // true,
  verbose: true
}
