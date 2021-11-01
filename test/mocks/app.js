const nuxtApp = {}
export function setup (nuxt) {
  Object.assign(nuxtApp, nuxt)
}

export function defineNuxtPlugin (cb) {
  cb(nuxtApp)
}
