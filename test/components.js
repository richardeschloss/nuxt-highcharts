import 'jsdom-global/register.js'
import { readFileSync } from 'fs'
import { promisify } from 'util'
import ava from 'ava'
import Vue from 'vue'
import ComponentFactory, { extendProps } from '../lib/components.js'

Vue.config.productionTip = false
Vue.config.devtools = false
const { serial: test } = ava
/**
 * @param {number} ms
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function loadComponent (opts, variant = 'chart') {
  const Comp = Vue.extend(ComponentFactory(variant, {}))
  const comp = new Comp(opts)
  comp.$nextTickP = promisify(comp.$nextTick)
  await comp.$mount()
  return comp
}

// @ts-ignore
global.fetch = function () {
  return ({
    json: () => ({ title: 'testData' })
  })
}

extendProps(['exporting', 'map'])

test('Basic features, empty opts', async (t) => {
  const Comp = Vue.extend(ComponentFactory('chart', {}))
  const comp = new Comp()
  comp.$nextTickP = promisify(comp.$nextTick)
  comp.$mount()
  await comp.$nextTickP()
  t.truthy(comp.chart)
  t.false(comp.exporting)
  comp.$destroy()
})

test('Features, (from module options)', (t) => {
  const Comp = Vue.extend(ComponentFactory('chart', {
    exporting: true
  }))
  const comp = new Comp({})
  t.true(comp.exporting)
})

test('Features and options, as props', async (t) => {
  const comp = await loadComponent({
    propsData: {
      exporting: true,
      setOptions: {
        lang: {
          decimalPoint: ','
        }
      }
    }
  })
  const opts = comp.highcharts.getOptions()
  t.is(opts.lang.decimalPoint, ',')
  t.true(comp.exporting)
})

test('Map chart (<highchart :modules=["map"] />', async (t) => {
  const comp = await loadComponent({
    propsData: {
      modules: ['map']
    }
  })
  await delay(500)
  t.truthy(comp.highcharts.mapChart)
}, 'mapChart')

test('Map chart (<highmap />', async (t) => {
  const comp = await loadComponent({}, 'mapChart')
  await delay(500)
  t.truthy(comp.highcharts.mapChart)
}, 'mapChart')

test('Map chart (mapChart info as a prop)', async (t) => {
  const comp = await loadComponent({
    propsData: {
      map: {
        mapName: 'providedMap',
        mapData: '/path/to/map.json'
      },
      modules: ['map']
    }
  })
  await delay(500)
  t.truthy(comp.highcharts.maps.providedMap)
}, 'mapChart')

test('Highcharts More', async (t) => {
  const comp = await loadComponent({
    propsData: {
      more: true
    }
  })

  await delay(500)
  t.true(Object.prototype.hasOwnProperty.call(comp.highcharts._modules, 'masters/highcharts-more.src.js'))
})

test('Basic chart', async (t) => {
  const chartOpts = JSON.parse(readFileSync('./test/data/chartOpts.json', { encoding: 'utf-8' }))
  const comp = await loadComponent({
    propsData: {
      options: chartOpts.dflt
    }
  })
  t.is(comp.options.title.text, chartOpts.dflt.title.text)
  comp.options.title.text = comp.options.title.text + ' something new!'
  await comp.$nextTickP()
  t.is(comp.chart.title.textStr, comp.options.title.text)
})

test('Basic chart, specified watchers', async (t) => {
  const chartOpts = JSON.parse(readFileSync('./test/data/chartOpts.json', { encoding: 'utf-8' }))
  const basicChart = ComponentFactory('chart', {})
  const Comp = Vue.extend(basicChart)
  const watchers = Object.keys(basicChart.methods).filter(m => m.includes('options'))
  watchers.push('invalid')
  const comp = new Comp({
    propsData: {
      options: chartOpts.dflt,
      update: watchers
    }
  })
  comp.$nextTickP = promisify(comp.$nextTick)
  comp.$mount()
  Object.assign(comp.options, chartOpts.changed)
  await comp.$nextTick()
  t.is(comp.chart.title.textStr, comp.options.title.text)
  t.is(comp.chart.caption.textStr, comp.options.caption.text)
  t.is(comp.chart.subtitle.textStr, comp.options.subtitle.text)
  t.is(comp.chart.xAxis[0].axisTitle.textStr, comp.options.xAxis[0].title.text)
  t.is(comp.chart.yAxis[0].axisTitle.textStr, comp.options.yAxis[0].title.text)
  const newText = 'someNewText'
  watchers.forEach((w) => {
    const key = w.split('options.')[1]
    if (key === 'xAxis' || key === 'yAxis') {
      comp.options[key] = { title: { text: newText } }
    } else {
      comp.options[key] = { text: newText }
    }
  })

  await comp.$nextTick()
  t.is(comp.chart.title.textStr, newText)
  t.is(comp.chart.caption.textStr, newText)
  t.is(comp.chart.subtitle.textStr, newText)
  t.is(comp.chart.xAxis[0].axisTitle.textStr, newText)
  t.is(comp.chart.yAxis[0].axisTitle.textStr, newText)

  comp.options.series = null
  comp.options.xAxis = null
  comp.options.yAxis = null
  await comp.$nextTick()
  t.is(comp.chart.xAxis[0].axisTitle.textStr, newText)
  t.is(comp.chart.yAxis[0].axisTitle.textStr, newText)

  const newText2 = 'text in array'
  comp.options.xAxis = [{ title: { text: newText2 } }]
  comp.options.yAxis = [{ title: { text: newText2 } }]

  await comp.$nextTick()
  t.is(comp.chart.xAxis[0].axisTitle.textStr, newText2)
  t.is(comp.chart.yAxis[0].axisTitle.textStr, newText2)
})
