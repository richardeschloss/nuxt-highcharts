import Vue from 'vue'
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'

const _pOptions = (function() {
  let _pluginOptions
  if (process.env.TEST === undefined) {
    _pluginOptions = <%= JSON.stringify(options) %>
  }

  return Object.freeze({
    get: () => _pluginOptions,
    set: (opts) => (_pluginOptions = opts)
  })
})()

const pluginOptions = _pOptions.get()
console.log('options', pluginOptions)

const Features = Object.freeze({
  exporting () {
    const { default: exportingInit } = require('highcharts/modules/exporting')
    exportingInit(Highcharts)
    return { featureAdded: 'exporting' }
  },
  async mapChart ({ mapName, mapData, mapDataURL }) {
    let useMapData = mapData
    if (mapDataURL !== undefined) {
      useMapData = await fetch(mapDataURL).then((res) => res.json())
    }

    const { default: mapInit } = require('highcharts/modules/map')
    mapInit(Highcharts)
    if (mapName && useMapData) {
      console.log('useMap data!!', mapName, useMapData)
      Highcharts.maps[mapName] = useMapData
    }
    return { featureAdded: 'mapChart', maps: Highcharts.maps }
  },
  stockChart () {
    const { default: stockInit } = require('highcharts/modules/stock')
    stockInit(Highcharts)
    return { featureAdded: 'stockChart' }
  }
})
const SupportedFeatures = Object.keys(Features)

// import stockInit from 'highcharts/modules/stock'
// import mapInit from 'highcharts/modules/map'

// import addWorldMap from '../static/worldmap' // TBD
// stockInit(Highcharts)
// mapInit(Highcharts)
// addWorldMap(Highcharts)

// stockInit(Highcharts)

Vue.use(HighchartsVue)

const NuxtHighcharts = Object.freeze({
  Highcharts,
  supportedFeatures: SupportedFeatures,
  use(feature, opts) {
    if (Features[feature] !== undefined) { 
      return Features[feature](opts)
    } else {
      return { err: 'feature_not_supported' }
    }
  }  
})

const register = Object.freeze({
  features(list = pluginOptions.features) {
    Object.entries(list).forEach(([feature, opts]) => {
      if (opts) {
        NuxtHighcharts.use(feature, opts)
      }
    })
  }
})
register.features()

export default async function (context, inject) {
  inject('highcharts', NuxtHighcharts)
}

export let pOptions
if (process.env.TEST) {
  pOptions = {}
  Object.assign(pOptions, _pOptions)
}