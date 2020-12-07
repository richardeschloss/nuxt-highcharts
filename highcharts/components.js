import Highcharts from 'highcharts'

const highchartsProps = Object.freeze({
  mapChart(props, dfltOptions) {
    props.mapChart = {
      type: Object,
      default: () => (dfltOptions.mapChart || {})
    }
  }
})

const highchartsData = Object.freeze({
  /**
   * Map chart data options
   * Default map options requires @highcharts/map-collection installed
   * @param {object} opts
   * @param {string} [opts.mapName] - defaults to 'myMapName
   * @param {object|string} [opts.mapData] - defaults to world geo map JSON
   */
  async mapChart({
    mapName = 'myMapName', 
    mapData = require('@highcharts/map-collection/custom/world.geo.json')
  }) {
    if (typeof mapData === 'string') {
      mapData = await (await fetch(mapData)).json()
    }
    Highcharts.maps[mapName] = { ...mapData }
  }
})

const highchartsMods = Object.freeze({
  exporting(HC) {
    const { default: exportingInit } = require('highcharts/modules/exporting')
    exportingInit(HC)
    return { featureAdded: 'exporting' }
  },
  stockChart(HC) {
    const { default: stockInit } = require('highcharts/modules/stock')
    stockInit(HC)
    return { featureAdded: 'stockChart' }
  },
  mapChart(HC) { 
    const { default: mapInit } = require('highcharts/modules/map')
    mapInit(HC)
    return { featureAdded: 'mapChart' }
  },
  sunburstChart(HC) {
    const { default: sunburstInit } = require('highcharts/modules/sunburst')
    sunburstInit(HC)
    return { featureAdded: 'sunburstChart' }
  },
})

// --- TBD  --- //
function camelCase(str) {
  return str
    .replace(/[\s\-](.)/g, function($1) {
      return $1.toUpperCase()
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase()
    })
    .replace(/[^\w\s]/gi, '')
}

// TBD inject in plugin?
// function populateModules() {
  const { readdirSync } = require('fs')
  const hcMods = readdirSync('node_modules/highcharts/modules')
    .filter((f) => f.endsWith('.js') && !f.endsWith('.src.js'))
    .map((f) => {
      const fName = f.replace('.js', '')
      const name = camelCase(fName)
      const initializer = (HC) => {
        const { default: init } = require('highcharts/modules/' + fName)
        init(HC)
      }
      return {
        name, // may be overkill
        fName,
        initializer
      }
    })
  
  // console.log('mods', mods)
// }
// populateModules()

export default function ComponentFactory(
  variant = 'chart',
  dfltOptions = {}
) {
  const props = {
    options: {
      type: Object,
      default: () => (dfltOptions.chartOptions || {})
    },
    redraw: {
      type: Boolean,
      default: true
    },
    oneToOne: {
      type: Boolean,
      default: true
    },
    animation: {
      type: Object,
      default: () => ({})
    },
    highcharts: {
      type: Object,
      default: () => (Highcharts)
    },
    exporting: {
      type: Boolean,
      default: dfltOptions.exporting !== undefined ? dfltOptions.exporting : false
    },
    update: {
      type: Array,
      default: () => ['options']
    },
    setOptions: {
      type: Object,
      default: () => (dfltOptions.setOptions)
    },
    modules: {
      type: Array,
      default: () => []
    }
  }
  if (highchartsProps[variant]) {
    /* Extend the props if a certain module requires it 
    *  E.g., mapChart
    */
    highchartsProps[variant](props, dfltOptions)
  }
  return {
    render: createElement => createElement('div', {
      ref: dfltOptions.ref || 'chart'
    }),
    props,
    computed: {
      optsCopy() {
        return { ...this.options }
      }
    },
    methods: {
      'options.caption'(newValue) {
        this.chart.setCaption(newValue)
      },
      'options.series'(newValue) {
        if (!newValue) return
        this.chart.series.forEach((s, idx) => {
          s.update(newValue[idx])
        })
      },
      'options.subtitle'(newValue) {
        this.chart.setSubtitle(newValue)
      },
      'options.title'(newValue) {
        this.chart.setTitle(newValue)
      },
      'options.yAxis'(newValue) {
        if (!newValue) return
        if (Array.isArray(newValue)) {
          this.chart.yAxis.forEach((a, idx) => {
            a.update(newValue[idx])
          })
        } else {
          this.chart.yAxis[0].update(newValue)
        }
      },
      'options.xAxis'(newValue) {
        if (!newValue) return
        if (Array.isArray(newValue)) {
          this.chart.xAxis.forEach((a, idx) => {
            a.update(newValue[idx])
          })
        } else {
          this.chart.xAxis[0].update(newValue)
        }
      },
      updateAll(newValue) {
        this.chart.update(newValue, this.redraw, this.oneToOne, this.animation)
      },
      updateWatchers(watchers, oldWatchers) {
        this.unwatch.forEach((u) => u())
        this.unwatch = []
        this.update.forEach((watcher) => {
          const w = this[watcher] || this.updateAll
          if (watcher === 'options') {
            this.unwatch.push(this.$watch(watcher, this.updateAll, { deep: true }))
          } else if (w && typeof w === 'function') {
            this.unwatch.push(this.$watch(watcher, w))
          }
        })
      }
    },
    // beforeCreate maybe init the hcMods?
    // if (hcMods === undefined) { ... initHcMods }
    async mounted() {
      const HC = this.highcharts
      if (this.setOptions) {
        HC.setOptions(this.setOptions)
      }

      // --- TBD (Initialize modules)
      this.modules.forEach((modName) => {
        const fnd = hcMods.find(({ fName }) => fName === modName)
        fnd.initializer(HC)
        // if (highchartsData[variant]) { ... }
      })
      // ---

      if (highchartsMods[variant]) {
        highchartsMods[variant](HC)
        if (highchartsData[variant]) {
          const hcDataCopy = { ...this[variant] }
          await highchartsData[variant](hcDataCopy)
        }
      }

      if (this.exporting) {
        highchartsMods.exporting(HC)
      }
      const chartConstructor = HC[variant] || HC['chart']
      this.chart = chartConstructor(
        this.$refs[dfltOptions.ref || 'chart'],
        this.optsCopy,
        (resp) => {
          this.$emit('chartLoaded', resp)
        }
      )

      this.unwatch = []
      this.updateWatchers()
      this.$watch('update', this.updateWatchers)
    },
    beforeDestroy() {
      this.chart.destroy()
    }
  }
}