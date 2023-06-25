<template>
  <div>
    <button class="btn btn-primary" @click="append">
      Append Data
    </button>
    <highchart ref="chart2D" :options="chartOpts" :update="[]" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      cnt: 0,
      name: 'Example',
      points: []
    }
  },
  computed: {
    /** @returns {import('@/lib/types').ChartOptions} */
    chartOpts () {
      return {
        accessibility: { enabled: false },
        title: {
          text: '2D Data'
        },
        series: [{
          type: 'line',
          name: this.name,
          data: Array.from(this.points)
        }]
      }
    }
  },
  methods: {
    append () {
      this.points.push([this.cnt, Math.random() * 10])
      // @ts-ignore
      this.$refs.chart2D.chart.series[0].update(this.chartOpts.series[0])
      this.cnt++
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
