import Highcharts from 'highcharts'
import More from 'highcharts/highcharts-more'
import { hcModsContext } from './contexts'

const highchartsProps = Object.freeze({
  mapChart(props, dfltOptions) {
    props.mapChart = {
      type: Object,
      default: () => (dfltOptions.mapChart || {})
    }
  }
})

// To be deprecated:
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

// To be deprecated:
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

// -- v1.0.7:
const hcProps = {}
const hcMods = hcModsContext.keys()
  .filter((k) => !k.endsWith('.src.js'))
  .map((fName) => {
    const name = fName.replace(/(\.\/|\.js)/g, '')
    hcProps[name] = (dfltOptions) => {
      return {
        type: Object,
        default: () => (dfltOptions[name] || {})
      }
    }
    return { 
      name,
      initializer: (HC) => hcModsContext(fName)(HC)
    }
  })

const hcData = Object.freeze({
  /**
   * Map chart data options
   * Default map options requires @highcharts/map-collection installed
   * @param {object} opts
   * @param {string} [opts.mapName] - defaults to 'myMapName'
   * @param {object|string} [opts.mapData] - defaults to world geo map JSON
   */
  async map({
    mapName = 'myMapName', 
    mapData = require('@highcharts/map-collection/custom/world.geo.json')
  }) {
    if (typeof mapData === 'string') {
      mapData = await (await fetch(mapData)).json()
    }
    Highcharts.maps[mapName] = { ...mapData }
  }
})
// ---

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
    },
    more: {
      type: Boolean,
      default: false
    }
  }
  if (highchartsProps[variant]) { // <-- to be deprecated
    /* Extend the props if a certain module requires it 
    *  E.g., mapChart
    */
    highchartsProps[variant](props, dfltOptions)
  }
  Object.entries(hcProps).forEach(([prop, fn]) => {
    if (props[prop] === undefined && hcData[prop]) {
      props[prop] = fn(dfltOptions)
    }
  })
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
      constructChart() {
        const HC = this.highcharts
        const chartConstructor = HC[variant] || HC['chart']
        this.chart = chartConstructor(
          this.$refs[dfltOptions.ref || 'chart'],
          this.optsCopy,
          (resp) => {
            this.$emit('chartLoaded', resp)
          }
        )
      },
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
    async mounted() {
      const HC = this.highcharts
      if (this.setOptions) {
        HC.setOptions(this.setOptions)
      }

      // --- v1.0.8: Added "more" property, to enable more charts, like polar and bubble.
      if (this.more) {
        More(HC)
      }

      // --- v1.0.6: TBD (Initialize modules)
      this.modules.forEach(async (modName) => {
        const fnd = hcMods.find(({ name }) => name === modName)
        await fnd.initializer(HC)
        if (HC[modName + 'Chart']) {
          variant = modName + 'Chart'
        }
        if (hcData[modName]) {
          const hcDataCopy = { ...this[modName] }
          await hcData[modName](hcDataCopy)
        }

        if (!this.chart) {
          this.constructChart()
        }
      })
      // ---

      // To be deprecated:
      if (highchartsMods[variant]) {
        highchartsMods[variant](HC)
        if (highchartsData[variant]) {
          const hcDataCopy = { ...this[variant] }
          await highchartsData[variant](hcDataCopy)
        }
      }

      // To be deprecated:
      if (this.exporting) {
        highchartsMods.exporting(HC)
      }

      if (this.modules.length === 0) {
        this.constructChart()
      }

      this.unwatch = []
      this.updateWatchers()
      this.$watch('update', this.updateWatchers)
    },
    beforeDestroy() {
      this.chart.destroy()
    }
  }
}