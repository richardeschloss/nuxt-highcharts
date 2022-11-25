/* eslint-disable vue/one-component-per-file */
import 'jsdom-global/register.js'
import { readFileSync } from 'fs'
import ava from 'ava'
// @ts-ignore
import { h, createApp, nextTick } from 'vue'
import BrowserEnv from 'browser-env' // Gives us SVGElement
import ComponentFactory, { extendProps } from '../lib/components.js'
BrowserEnv()

const { serial: test } = ava
/**
 * @param {number} ms
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

async function loadComponent (opts = {}, variant = 'chart') {
  const Comp = createApp(ComponentFactory(variant, {}), opts)
  const comp = Comp.mount('#app')
  await nextTick()
  return { Comp, comp }
}

// @ts-ignore
global.fetch = function () {
  return ({
    json: () => ({ title: 'testData' })
  })
}

extendProps(['exporting', 'map'])

test('Basic features, empty opts', async (t) => {
  const Comp = createApp(ComponentFactory('chart', {}))
  const comp = Comp.mount('#app')
  await nextTick()
  t.truthy(comp.chart)
  t.false(comp.exporting)
  Comp.unmount()
})

test('Features, (from module options)', async (t) => {
  const Comp = createApp(ComponentFactory('chart', {
    exporting: true
  }))
  const comp = Comp.mount('#app')
  await nextTick()
  t.true(comp.exporting)
  Comp.unmount()
})

test('Features and options, as props', async (t) => {
  const { Comp, comp } = await loadComponent({
    exporting: true,
    setOptions: {
      lang: {
        decimalPoint: ','
      }
    }
  })
  const opts = comp.highcharts.getOptions()
  t.is(opts.lang.decimalPoint, ',')
  t.true(comp.exporting)
  Comp.unmount()
})

test('Map chart (<highchart :modules=["map"] />', async (t) => {
  const { Comp, comp } = await loadComponent({
    modules: ['map']
  }, 'mapChart')
  await delay(500)
  t.truthy(comp.highcharts.mapChart)
  Comp.unmount()
})

test('Map chart (<highmap />', async (t) => {
  const { Comp, comp } = await loadComponent({}, 'mapChart')
  await delay(500)
  t.truthy(comp.highcharts.mapChart)
  Comp.unmount()
})

test('Map chart (mapChart info as a prop)', async (t) => {
  const { Comp, comp } = await loadComponent({
    map: {
      mapName: 'providedMap',
      mapData: '/path/to/map.json'
    },
    modules: ['map']
  }, 'mapChart')
  await delay(500)
  t.truthy(comp.highcharts.maps.providedMap)
  Comp.unmount()
})

test('Highcharts More', async (t) => {
  const { comp, Comp } = await loadComponent({
    more: true
  })

  await delay(500)
  t.true(Object.prototype.hasOwnProperty.call(comp.highcharts._modules, 'masters/highcharts-more.src.js'))
  Comp.unmount()
})

test('Basic chart', async (t) => {
  const chartOpts = JSON.parse(readFileSync('./test/data/chartOpts.json', { encoding: 'utf-8' }))
  const Comp = ComponentFactory('chart', {})
  const App = createApp({
    data () {
      return {
        options: chartOpts.dflt
      }
    },
    render () {
      return h(Comp, {
        ref: 'comp',
        options: this.options,
        redraw: false // TBD: not sure why redrawing is broken when "series" is provided. (not broken in 10.0.0, only 10.1.0)
      })
    }
  })
  const app = App.mount('#app')
  await nextTick()
  const { comp } = app.$refs
  t.is(comp.options.title.text, chartOpts.dflt.title.text)
  app.options.title.text = 12131314
  await nextTick()
  t.is(comp.chart.title.textStr, comp.options.title.text)
  App.unmount()
})

test('Basic chart, specified watchers', async (t) => {
  const chartOpts = JSON.parse(readFileSync('./test/data/chartOpts.json', { encoding: 'utf-8' }))
  chartOpts.dflt.accessibility = { enabled: false }
  const Comp = ComponentFactory('chart', {})
  const watchers = Object.keys(Comp.methods).filter(m => m.includes('options'))
  watchers.push('invalid')

  const App = createApp({
    data () {
      return {
        options: chartOpts.dflt
      }
    },
    render () {
      return h(Comp, {
        ref: 'comp',
        options: this.options,
        update: watchers,
        redraw: false
      })
    }
  })
  const app = await App.mount('#app')
  const { comp } = app.$refs
  await nextTick()
  Object.assign(comp.options, chartOpts.changed)
  await nextTick()
  t.is(comp.chart.title.textStr, comp.options.title.text)
  t.is(comp.chart.caption.textStr, comp.options.caption.text)
  t.is(comp.chart.subtitle.textStr, comp.options.subtitle.text)
  t.is(comp.chart.xAxis[0].userOptions.title.text, comp.options.xAxis[0].title.text)
  t.is(comp.chart.yAxis[0].userOptions.title.text, comp.options.yAxis[0].title.text)

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
  t.is(comp.chart.xAxis[0].userOptions.title.text, newText)
  t.is(comp.chart.yAxis[0].userOptions.title.text, newText)

  comp.options.series = null
  comp.options.xAxis = null
  comp.options.yAxis = null
  await comp.$nextTick()
  t.is(comp.chart.xAxis[0].userOptions.title.text, newText)
  t.is(comp.chart.yAxis[0].userOptions.title.text, newText)

  const newText2 = 'text in array'
  comp.options.xAxis = [{ title: { text: newText2 } }]
  comp.options.yAxis = [{ title: { text: newText2 } }]

  await comp.$nextTick()
  t.is(comp.chart.xAxis[0].userOptions.title.text, newText2)
  t.is(comp.chart.yAxis[0].userOptions.title.text, newText2)
  App.unmount()
})

test('Stock chart (<highstock />)', async (t) => {
  const { Comp, comp } = await loadComponent({}, 'stockChart')
  await delay(500)
  t.truthy(comp.highcharts.stockChart)
  Comp.unmount()
})
