<template>
  <div class="row">
    <div class="form-group mx-auto">
      <label>Set the chart title (reactively)</label>
      <input v-model="title" class="form-control text-center">

      <button class="btn btn-primary" @click="points.push(Math.random()*10)">
        Append random data
      </button>
    </div>
    <button class="btn btn-primary" @click="width = (width === 100) ? 50 : 100">
      Toggle Full Width
    </button>
    <highchart
      ref="basicChart"
      :options="chartOptions"
      :modules="['exporting']"
      :update="watchers"
      :style="`width:${width}%;`"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: 50,
      caption: 'Chart caption here',
      title: 'Basic Chart',
      subtitle: 'More details here',
      points: [10, 0, 8, 2, 6, 4, 5, 5],
      seriesColor: '',
      animationDuration: 1000,
      chartType: '',
      colorInputIsSupported: null,
      chartTypes: [],
      durations: [0, 500, 1000, 2000],
      seriesName: 'My Data',
      yAxis: 'My Values',
      watchers: [
        'options.title',
        'options.series'
      ],
      colors: [
        'Red',
        'Green',
        'Blue',
        'Pink',
        'Orange',
        'Brown',
        'Black',
        'Purple'
      ],
      lastPointClicked: {
        timestamp: '',
        x: '',
        y: ''
      },
      sexy: false
    }
  },
  computed: {
    /** @returns {import('@/lib/types').ChartOptions} */
    chartOptions () {
      const ctx = this
      return {
        accessibility: {
          enabled: false
        },
        caption: {
          text: this.caption,
          style: {
            color: this.sexy ? this.invertedColor(0) : '#black'
          }
        },
        chart: {
          backgroundColor: this.sexy
            ? {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                  [0, this.seriesColor],
                  [0.5, '#ffffff'],
                  [1, this.seriesColor]
                ]
              }
            : '#ffffff',
          className: 'my-chart',
          type: this.chartType.toLowerCase()
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click () {
                  ctx.$emit('pointClicked', this)
                }
              }
            }
          }
        },
        yAxis: [{
          title: {
            text: this.yAxis,
            style: {
              color: '#000000'
            }
          }
        }],
        title: {
          style: {
            color: this.sexy ? this.invertedColor(0) : '#black'
          },
          text: `${this.title} ` +
            (this.lastPointClicked.timestamp !== ''
              ? `(Point clicked: ${this.lastPointClicked.timestamp})`
              : '')
        },
        subtitle: {
	        style: {
            color: this.sexy ? this.invertedColor(0) : '#black'
          },
          text: `${this.subtitle}`
        },
        legend: {
          itemStyle: {
            color: this.sexy ? this.invertedColor(0) : '#black'
          }
        },
        series: [{
          name: this.seriesName,
          data: this.points,
          color: this.seriesColor
        }]
      }
    }
  },
  mounted () {
    const resizeObserver = new ResizeObserver((entries) => {
      if (this.$refs.basicChart.chart) {
        this.$refs.basicChart.chart.reflow()
      }
    })
    resizeObserver.observe(this.$refs.basicChart.$el)
  }
}
</script>

<style scoped>

</style>
