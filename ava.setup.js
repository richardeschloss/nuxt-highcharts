/* eslint-disable no-console */

console.time('avaSetup_e2e')
require('jsdom-global')()
require('browser-env')()
const Vue = require('vue')
Vue.config.productionTip = false
// https://github.com/nuxt/create-nuxt-app/issues/180#issuecomment-463069941
window.Date = global.Date = Date

console.timeEnd('avaSetup_e2e')
