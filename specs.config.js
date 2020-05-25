export default {
  require: ['@babel/register', './ava.setup.js'],
  serial: true,
  files: [
    'test/module.spec.js',
    'test/components.spec.js'
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
