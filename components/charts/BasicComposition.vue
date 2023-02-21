<template>
  <div>
    <label>Basic composition</label>
    <highchart :options="chartOptions" exporting :modules="['exporting']"/>
  </div>
</template>

<script setup>
const chartOptions = reactive({
  title: {
    text: 'Some Text'
  },
  series: [{
    data: [[0, 0], [1, 1]]
  }]  
});

</script>

<style lang="scss" scoped>

</style>s