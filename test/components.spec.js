import test, { beforeEach } from 'ava'
import { shallowMount } from '@vue/test-utils'
import ComponentFactory from '@/highcharts/components'
import { nextTickP } from 'nuxt-test-utils'

const dfltOptions = {
  chartOptions: {
    caption: {
      text: 'Some caption'
    },
    chart: {
      type: 'spline'
    },
    xAxis: [{
      title: {
        text: 'xAxis title'
      }
    }],
    yAxis: [{
      title: {
        text: 'Values'
      }
    }],
    title: {
      text: `Some title`
    },
    subtitle: {
      text: `Some subtitle`
    },
    series: [{
      name: 'My series',
      data: [0, 1, 2, 3, 4]
    }]
  }
}

const changedOptions = {
  chartOptions: {
    caption: {
      text: 'changed caption'
    },
    chart: {
      type: 'area'
    },
    xAxis: [{
      title: {
        text: 'xAxis title changed'
      }
    }],
    yAxis: [{
      title: {
        text: 'changed Values'
      }
    }],
    title: {
      text: `changed title`
    },
    subtitle: {
      text: `changed subtitle`
    },
    series: [{
      name: 'changed series',
      data: [4, 3, 2, 1, 0]
    }]
  }
}

test('Basic chart, empty opts', (t) => {
  const basicChart = ComponentFactory('chart', {})
  const wrapper = shallowMount(basicChart, {})
  const ctx = wrapper.vm
  t.truthy(ctx.chart)
})

test('Basic chart, exporting enabled', (t) => {
  const basicChart = ComponentFactory('chart', { exporting: true })
  const wrapper = shallowMount(basicChart, {})
  const ctx = wrapper.vm
  t.true(ctx.exporting)
})

test('Basic chart, default options', async (t) => {
  const basicChart = ComponentFactory('chart', dfltOptions)
  const wrapper = shallowMount(basicChart, {})
  const ctx = wrapper.vm
  ctx.options.title.text = ctx.options.title.text + ' something new!'
  await nextTickP(ctx)
  t.is(ctx.chart.title.textStr, ctx.options.title.text)
})

test('Basic chart, specified watchers', async (t) => {
  const basicChart = ComponentFactory('chart', dfltOptions)
  const watchers = Object.keys(basicChart.methods).filter((m) => m.includes('options'))
  const optsCopy = { ...changedOptions.chartOptions }
  const wrapper = shallowMount(basicChart, {
    propsData: {
      update: watchers
    }
  })
  
  const ctx = wrapper.vm
  wrapper.setProps({
    options: optsCopy
  })

  await nextTickP(ctx)
  t.is(ctx.chart.title.textStr, ctx.options.title.text)
  t.is(ctx.chart.caption.textStr, ctx.options.caption.text)
  t.is(ctx.chart.subtitle.textStr, ctx.options.subtitle.text)
  t.is(ctx.chart.xAxis[0].axisTitle.textStr, ctx.options.xAxis[0].title.text)
  t.is(ctx.chart.yAxis[0].axisTitle.textStr, ctx.options.yAxis[0].title.text)
})

test('Basic chart, specified watchers (mixed types)', async (t) => {
  const basicChart = ComponentFactory('chart', dfltOptions)
  const watchers = Object.keys(basicChart.methods).filter((m) => m.includes('options'))
  const optsCopy = { ...changedOptions.chartOptions }
  const wrapper = shallowMount(basicChart, {
    propsData: {
      update: watchers
    }
  })
  wrapper.setProps({
    options: {
      xAxis: {
        title: {
          text: 'xAxis title changed again'
        }
      },
      yAxis: {
        title: {
          text: 'changed Values again'
        }
      },
    }
  })

  const ctx = wrapper.vm
  await nextTickP(ctx)
  t.falsy(ctx.chart.xAxis.axisTitle)
  t.falsy(ctx.chart.yAxis.axisTitle)
})

test('Basic chart, specified watchers (xAxis and yAxis as objects)', async (t) => {
  const basicChart = ComponentFactory('chart', {
    chartOptions: {
      xAxis: {
        title: {
          text: 'xAxis title'
        }
      },
      yAxis: {
        title: {
          text: 'yAxis title'
        }
      }
    }
  })
  const watchers = Object.keys(basicChart.methods).filter((m) => m.includes('options'))
  const wrapper = shallowMount(basicChart, {
    propsData: {
      update: watchers
    }
  })
  const ctx = wrapper.vm
  const newOpts = {
    xAxis: {
      title: {
        text: 'xAxis title changed again'
      }
    },
    yAxis: {
      title: {
        text: 'changed Values again'
      }
    }
  }
  wrapper.setProps({ options: newOpts })
  
  await nextTickP(ctx)
  t.is(ctx.chart.xAxis[0].options.title.text, newOpts.xAxis.title.text)
  t.is(ctx.chart.yAxis[0].options.title.text, newOpts.yAxis.title.text)
})

test('Basic chart, specified watchers (new values undefined)', async (t) => {
  const basicChart = ComponentFactory('chart', dfltOptions)
  const watchers = Object.keys(basicChart.methods).filter((m) => m.includes('options'))
  const wrapper = shallowMount(basicChart, {
    propsData: {
      update: watchers
    }
  })
  const ctx = wrapper.vm
  wrapper.setProps({ options: {} })
  
  await nextTickP(ctx)
  t.is(ctx.chart.xAxis[0].options.title.text, dfltOptions.chartOptions.xAxis[0].title.text)
  t.is(ctx.chart.yAxis[0].options.title.text, dfltOptions.chartOptions.yAxis[0].title.text)
})

test('Basic chart, nonexistant watchers', async (t) => {
  const basicChart = ComponentFactory('chart', dfltOptions)
  const watchers = Object.keys(basicChart.methods).filter((m) => m.includes('options'))
  const wrapper = shallowMount(basicChart, {
    propsData: {
      update: ['nonexistant', 'chart']
    }
  })
  const ctx = wrapper.vm
  const newOpts = {
    title: { text: 'new text' }
  }
  wrapper.setProps({ options: newOpts })
  
  await nextTickP(ctx)
  t.is(ctx.chart.xAxis[0].options.title.text, dfltOptions.chartOptions.xAxis[0].title.text)
  t.is(ctx.chart.yAxis[0].options.title.text, dfltOptions.chartOptions.yAxis[0].title.text)

  wrapper.setProps({ 
    update: []
  })
  await nextTickP(ctx)
  t.is(ctx.unwatch.length, 0)
})

test('Basic chart generated as default', (t) => {
  const basicChart = ComponentFactory()
  const wrapper = shallowMount(basicChart, {})
  const ctx = wrapper.vm
  t.is(ctx.highcharts.product, 'Highcharts')
})

test('Stock chart', (t) => {
  const stockChart = ComponentFactory('stockChart', dfltOptions)
  const wrapper = shallowMount(stockChart, {})
  const ctx = wrapper.vm
  t.truthy(ctx.highcharts.StockChart)
})

test('Map chart', (t) => {
  const mapChart = ComponentFactory('mapChart', dfltOptions)
  const wrapper = shallowMount(mapChart, {})
  const ctx = wrapper.vm
  t.truthy(ctx.highcharts.mapChart)
})

test('Map chart (mapData as a url)', async (t) => {
  const mapChart = ComponentFactory('mapChart', dfltOptions)
  let fetched
  // @ts-ignore
  global.fetch = function(url) {
    fetched = url
    return {
      json() {
        return { title: 'testData' } 
      }
    }
  }
  const wrapper = await shallowMount(mapChart, {
    propsData: {
      mapChart: {
        mapName: 'providedMap',
        mapData: '/path/to/map.json'
      }
    }
  })
  const ctx = wrapper.vm
  t.is(fetched, '/path/to/map.json')
  // @ts-ignore
  t.truthy(ctx.highcharts.maps['providedMap'])
  // @ts-ignore
  t.is(ctx.highcharts.maps['providedMap'].title, 'testData')
})

test('Sunburst chart', (t) => {
  const sunburstChart = ComponentFactory('sunburstChart')
  const wrapper = shallowMount(sunburstChart)
  const ctx = wrapper.vm
  t.true(ctx.highcharts._modules.hasOwnProperty('modules/sunburst.src.js'))
})

test('Destroy chart if it exists', (t) => {
  const basicChart = ComponentFactory()
  const wrapper = shallowMount(basicChart, {})
  const ctx = wrapper.vm
  ctx.$destroy() 
  t.is(Object.keys(ctx.chart).length, 0)
})