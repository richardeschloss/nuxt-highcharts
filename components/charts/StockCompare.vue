<template>
  <highstock :options="chartOpts" />
</template>

<script>
export default {
  data () {
    return {
      series: []
    }
  },
  computed: {
    chartOpts () {
      return {
        rangeSelector: {
          selected: 4
        },

        yAxis: {
          labels: {
            formatter () {
              return (this.value > 0 ? ' + ' : '') + this.value + '%'
            }
          },
          plotLines: [{
            value: 0,
            width: 2,
            color: 'silver'
          }]
        },

        plotOptions: {
          series: {
            compare: 'percent',
            showInNavigator: true
          }
        },

        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
          valueDecimals: 2,
          split: true
        },

        series: this.series
      }
    }
  },
  mounted () {
    const symbols = ['goog', 'aapl', 'msft']
    symbols.forEach(s => this.fetchData(s))
  },
  methods: {
    async fetchData (symbol) {
      const data = await fetch(`/${symbol}-c.json`).then(r => r.json())
      this.series.push({
        name: symbol,
        data
      })
    }
  }
}
</script>
