const ctx = {
  components: {},
  vueApp: {
    component (name, comp) {
      ctx.components[name] = comp
    }
  },
  provide (label, fn) {
    ctx['$' + label] = fn
  },
  $config: {
    public: {}
  }
}

export let pluginDef

// lib/plugin.js will call this...
export function defineNuxtPlugin (cb) {
  pluginDef = cb
}

// This returns a clean copy of the ctx
export function pluginCtx () {
  return { ...ctx }
}
