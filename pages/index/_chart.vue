<template>
  <div>
    <transition name="page">
      <component :is="$route.params.chart" />
    </transition>
  </div>
</template>

<script>
import Chart from '@/components/Chart'
import StockChart from '@/components/StockChart'
import MapChart from '@/components/MapChart'

export default {
  components: {
    Chart,
    StockChart,
    MapChart
  }
}
</script>
