<template>
  <div>
    <transition name="page">
      <component :is="$route.params.chart" />
    </transition>
  </div>
</template>

<script>
import AfricaMap from '@/components/AfricaMap.vue'
import BubbleChart from '@/components/BubbleChart.vue'
import Chart from '@/components/Chart.vue'
import StockChart from '@/components/StockChart.vue'
import MapChart from '@/components/MapChart.vue'
import QuickMods from '@/components/QuickMods.vue'
import SunburstChart from '@/components/SunburstChart.vue'
import StockCompare from '@/components/StockCompare.vue'

export default {
  components: {
    AfricaMap,
    BubbleChart,
    Chart,
    StockChart,
    MapChart,
    QuickMods,
    SunburstChart,
    StockCompare
  }
}
</script>
