import Highcharts from 'highcharts'

const highchartsProps = Object.freeze({
  mapChart(props, dfltOptions) {
    props.mapChart = {
      type: Object,
      default: () => (dfltOptions.mapChart || {})
    }
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
  mapChart(HC, { mapChart }) {
    const mapName = mapChart.mapName || 'myMapName'
    const mapData = mapChart.mapData || require('@highcharts/map-collection/custom/world.geo.json')
    const { default: mapInit } = require('highcharts/modules/map')
    mapInit(HC)
    Highcharts.maps[mapName] = mapData
    return { featureAdded: 'mapChart', maps: Highcharts.maps }
  },
  sunburstChart(HC) {
    const { default: sunburstInit } = require('highcharts/modules/sunburst')
    sunburstInit(HC)
    return { featureAdded: 'sunburstChart' }
  },
})

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
    }
  }
  if (highchartsProps[variant]) {
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
    mounted() {
      const HC = this.highcharts
      if (highchartsMods[variant]) {
        highchartsMods[variant](HC, props)
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