import test, { beforeEach } from 'ava'
import { shallowMount } from '@vue/test-utils'
import ComponentFactory from '@/highcharts/components'
import { nextTickP } from 'nuxt-test-utils'

test('Components (Basic chart)', async (t) => {
  const dfltOptions = {
    chartOptions: {
      caption: {
        text: 'Some caption'
      },
      chart: {
        type: 'spline'
      },
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
  const basicChart1 = ComponentFactory('chart', {})
  const wrapper1 = shallowMount(basicChart1, {})
  const ctx1 = wrapper1.vm 
  t.truthy(ctx1.chart)

  const basicChart2 = ComponentFactory('chart', { exporting: true })
  const wrapper2 = shallowMount(basicChart2, {})
  const ctx2 = wrapper2.vm
  t.truthy(ctx2.exporting)

  const basicChart3 = ComponentFactory('chart', dfltOptions)
  const wrapper3 = shallowMount(basicChart3, {})
  const ctx3 = wrapper3.vm

  ctx3.options.title.text = ctx3.options.title.text + ' something new!'
  await nextTickP(ctx3)
  t.is(ctx3.chart.title.textStr, ctx3.options.title.text)
})