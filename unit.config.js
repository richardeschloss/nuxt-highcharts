export default {
  require: ['@babel/register', './ava.setup.js'],
  serial: true,
  files: [
    'test/unit/module.js',
    'test/unit/components.js'
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
  tap: false,
  verbose: true
}
