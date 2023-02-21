<template>
  <div>
    <label>Basic composition</label>
    <div><input v-model="chartOptions.title.text" class="form-control text-center"></div>

    <highchart :options="chartOptions" :modules="['exporting']" />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const chartOptions = reactive({
  title: {
    text: 'Some Text (Change Me!)'
  },
  series: [{
    data: [[0, 0], [1, 1]]
  }]
})

</script>

<style lang="scss" scoped>

</style>s
