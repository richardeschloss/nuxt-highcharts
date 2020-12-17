<template>
  <div>
    <b-input-group class="mt-3">
      <b-form-input
        id="symbol"
        v-model="symbol"
        class="form-control centered"
        @input="onInput($event)"
        @keyup.enter="updateChart($event)"
        @focus="watchers = ['options.title', 'options.subtitle']"
        @blur="
          watchers = ['options.title', 'options.subtitle', 'options.series']
        "
      />
      <b-input-group-append>
        <b-button
          id="submit-btn"
          variant="info"
          class="btn btn-primary"
          @click="getItems()"
          >Get Chart</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <div class="row">
      <div class="col-9-auto col-md-9">
        <highstock :options="chartOptions" :update="watchers" />
      </div>
      <div class="col-3-auto col-md-3">
        <b-table-lite
          striped
          thead-class="d-none"
          :items="quote ? Object.entries(quote) : []"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      symbol: 'AAPL',
      watchers: ['options.title', 'options.subtitle', 'options.series'],
      result: {},
      itemsResp: [],
    }
  },
  computed: {
    companyName() {
      return this.quote !== undefined ? this.quote.companyName : '[fetching]'
    },
    quote() {
      return this.itemsResp !== null ? this.itemsResp[0] : {}
    },
    ohlcv() {
      if (this.itemsResp === null || this.itemsResp[1] === undefined) return []

      const ohlcv = this.itemsResp[1].history.map((entry) => {
        return [entry.epochTime, entry.open, entry.high, entry.low, entry.close]
      })
      return ohlcv
    },
    chartOptions() {
      return {
        chart: {
          type: 'candlestick',
        },
        rangeSelector: {
          selected: 1,
        },
        title: {
          text: `${this.symbol} Stock Price`,
        },
        subtitle: {
          text: `${this.companyName} Stock Price`,
        },
        series: [
          {
            name: this.symbol,
            data: this.ohlcv,
            // pointStart: Date.UTC(2018, 1, 1),
            // pointInterval: 1000 * 3600 * 24,
            tooltip: {
              valueDecimals: 2,
            },
          },
        ],
      }
    },
    itemsMsg() {
      return { items: ['quote', 'ohlcv'], symbol: this.symbol }
    },
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/finance',
      namespaceCfg: {
        emitters: ['getItems + itemsMsg --> itemsResp'],
      },
    })
    this.getItems()
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onInput(evt) {
      if (process.env.NODE_ENV === 'development') {
        // Only go super fast in dev mode because we can get rate-limited
        // in prod.
        this.getItems()
      }
    },
    updateChart(evt) {
      evt.target.blur()
      this.chartOptions.series[0].data = []
      this.getItems().then(() => {
        evt.target.focus()
        evt.target.select()
      })
    },
  },
}
</script>
<style scoped></style>
