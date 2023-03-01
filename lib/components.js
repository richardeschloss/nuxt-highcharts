import Highcharts from 'highcharts'
import { h } from 'vue'
// @ts-ignore
import hcMods from '#build/nuxt-highcharts.hcMods.js'

const variantModules = {
  mapChart: ['map'],
  stockChart: ['stock']
}

let hcProps

/**
 * Create props from the highcharts modules names.
 * For example, exporting can be enabled with:
 * - <highchart :exporting="true" /> or
 * - <highchart :modules=['exporting'] />
 * @param {Array<String>} hcModNames
 */
export function extendProps (hcModNames) {
  hcProps = {}
  hcModNames.forEach((name) => {
    hcProps[name] = (dfltOptions) => {
      return {
        type: Object,
        default: () => (dfltOptions[name] || {})
      }
    }
  })
}

const hcData = Object.freeze({
  async stock ({ HC }) {
    const Data = (await import('highcharts/modules/data.js')).default
    const Indicators = (await import('highcharts/indicators/indicators-all.src.js')).default
    Data(HC)
    Indicators(HC)
  },
  /**
   * Map chart data options
   * Default map options requires @highcharts/map-collection installed
   * @param {object} opts
   * @param {string} [opts.mapName] - defaults to 'myMapName'
   * @param {object|string} [opts.mapData]
   * @param {import('highcharts')} [opts.HC]
   * @param {import('highcharts/modules/map')} [opts.HC.maps]
   */
  async map ({
    mapName = 'myMapName',
    mapData,
    HC
  }) {
    if (!mapData) {
      // eslint-disable-next-line no-console
      console.error('[nuxt-highcharts] No mapData provided')
      return
    }
    if (typeof mapData === 'string') {
      mapData = await (await fetch(mapData)).json()
    }

    HC.maps[mapName] = { ...mapData }
  }
})

/**
 * Component Factory - used to create three
 * components:
 * - <highchart />
 * - <highstock />
 * - <highmap />
 * @param {string} variant = 'chart'
 * @param {*} dfltOptions = {}
 */
export default function ComponentFactory (
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
  Object.entries(hcProps).forEach(([prop, fn]) => {
    if (props[prop] === undefined && hcData[prop]) {
      props[prop] = fn(dfltOptions)
    }
  })
  const chartRef = 'chart' + Date.now()
  /** @type {import('vue/types/vue').ExtendedVue} */
  return {
    render: () => h('div', { // TBD: In Vue3, we will import h and leave the function argument blank.
      ref: dfltOptions.ref || chartRef
    }),
    props,
    computed: {
      optsCopy () {
        return { ...this.options }
      }
    },
    methods: {
      constructChart (HC) {
        const chartConstructor = HC[variant]
        this.chart = chartConstructor(
          this.$refs[dfltOptions.ref || chartRef], // Highchart element
          this.optsCopy,
          (resp) => {
            this.$emit('chartLoaded', resp)
          }
        )
      },
      'options.caption' (newValue) {
        this.chart.setCaption(newValue)
      },
      'options.series' (newValue) {
        if (!newValue) { return }
        this.chart.series.forEach((s, idx) => {
          s.update(newValue[idx], this.redraw)
        })
      },
      'options.subtitle' (newValue) {
        this.chart.setSubtitle(newValue)
      },
      'options.title' (newValue) {
        this.chart.setTitle(newValue)
      },
      'options.yAxis' (newValue) {
        if (!newValue) { return }
        if (Array.isArray(newValue)) {
          this.chart.yAxis.forEach((a, idx) => {
            a.update(newValue[idx], this.redraw)
          })
        } else {
          this.chart.yAxis[0].update(newValue, this.redraw)
        }
      },
      'options.xAxis' (newValue) {
        if (!newValue) { return }
        if (Array.isArray(newValue)) {
          this.chart.xAxis.forEach((a, idx) => {
            a.update(newValue[idx], this.redraw)
          })
        } else {
          this.chart.xAxis[0].update(newValue, this.redraw)
        }
      },
      updateAll (newValue) {
        this.chart.update(newValue, this.redraw, this.oneToOne, this.animation)
      },
      updateWatchers () {
        this.unwatch.forEach(u => u())
        this.unwatch = []
        this.update.forEach((watcher) => {
          const w = this[watcher] || this.updateAll
          if (watcher === 'options') {
            this.unwatch.push(this.$watch(watcher, this.updateAll, { deep: true }))
          } else if (w && typeof w === 'function') {
            this.unwatch.push(this.$watch(watcher, w, { deep: true }))
          }
        })
      }
    },
    async mounted () {
      const HC = this.highcharts
      if (this.setOptions) {
        HC.setOptions(this.setOptions)
      }

      if (this.more) {
        const { default: More } = await import('highcharts/highcharts-more.js')
        More(HC)
      }

      let useModules = this.modules
      if (variantModules[variant]) {
        useModules.unshift(variantModules[variant])
      }

      const p = useModules.map(async (modName) => {
        const { default: hcMod } = await hcMods[modName]()
        await hcMod(HC)
        if (HC[modName + 'Chart']) {
          variant = modName + 'Chart'
        }
        if (hcData[modName]) {
          const hcDataCopy = { ...this[modName], HC }
          await hcData[modName](hcDataCopy)
        }
      })
      await Promise.all(p)

      if (!this.chart) {
        this.constructChart(HC)
      }

      this.unwatch = []
      this.updateWatchers()
      this.$watch('update', this.updateWatchers)
    },
    beforeUnmount () {
      if (this.chart) {
        this.chart.destroy()
      }
    }
  }
}
