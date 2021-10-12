<template>
  <highstock :options="chartOptions" />
</template>

<script>
export default {
  data() {
    return {
      symbol: 'AAPL',
      watchers: ['options.series'],
      series: []
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: 'candlestick'
        },
        rangeSelector: {
          selected: 4
        },
        title: {
          text: `${this.symbol} Stock Price`
        },
        series: this.series
      }
    }
  },
  mounted() {
    this.fetchData('AAPL')
  },
  methods: {
    async fetchData(symbol) {
      const { price } = await fetch('/ohlcv.json').then(r => r.json())
      this.series.push({
        name: symbol,
        data: price.map((entry) => {
          return [
            entry.epochTime.epochTime,
            entry.open.val,
            entry.high.val,
            entry.low.val,
            entry.close.val,
          ]
        })
      })
    }
  }
}
</script>
