export default {
  files: [
    'test/module.js',
    'test/plugin.js',
    'test/components.js'
  ],
  nodeArguments: [
    '--no-warnings',
    '--experimental-json-modules'
  ],
  tap: false,
  verbose: true
}
