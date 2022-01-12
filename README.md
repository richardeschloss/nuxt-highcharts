# nuxt-highcharts

[![npm version][npm-version-src]][npm-version-href]
[![npm][npm-downloads-src]][npm-downloads-href]
[![](https://gitlab.com/richardeschloss/nuxt-highcharts/badges/master/pipeline.svg)](https://gitlab.com/richardeschloss/nuxt-highcharts)
[![](https://gitlab.com/richardeschloss/nuxt-highcharts/badges/master/coverage.svg)](https://gitlab.com/richardeschloss/nuxt-highcharts)
[![License][license-src]][license-href]

> Highcharts for Nuxt

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `nuxt-highcharts` dependency to your project

* Nuxt 2.x:
```bash
npm i nuxt-highcharts
```

* Nuxt 3.x:
```bash
npm i nuxt-highcharts@next
```

- These are the module's *required* dependencies:
  *  [highcharts](https://www.npmjs.com/package/highcharts) - The charting library.

- These are the module's *optional* dependencies:
  * [@highcharts/map-collection](https://www.npmjs.com/package/@highcharts/map-collection) - Collection of maps to use with Highmap. Please be aware of their [LICENSE](https://github.com/highcharts/map-collection-dist/blob/master/LICENSE.md). This module uses it strictly for demo purposes (and is non-profit, open-source). 


2. Add `nuxt-highcharts` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'nuxt-highcharts',

    // With options
    ['nuxt-highcharts', { /* module options */ }]
  ],
  highcharts: {
    /* module options */
  }
}
```

## Quick-Start Example

1. For the impatient that "just need it to work", this is your easiest option! 
```
<highchart :options="chartOptions" />
```

2. If you plan to only change the title and series data, this will update the chart faster than the previous example:
```
<highchart 
  :options="chartOptions" 
  :update="['options.title', 'options.series']" 
/>
```

3. Looking for more? The most up-to-date examples are in this [git repo!](https://github.com/richardeschloss/nuxt-highcharts). The demo uses this repo directly!

### Module Options

| Option | Type |  Description |
| ---| --- | --- |
| `chartOptions` | Object | Default chart options to use for the highchart components. These get wired to [Highcharts](https://api.highcharts.com/highcharts). Useful tip: `import('highcharts/highcharts').Options` to get intellisense suggestions |
|`exporting` | Boolean | Enable/disable the exporting feature globally |
| `setOptions` | Object | Options to use globally, that get sent to [Highcharts.setOptions](https://api.highcharts.com/highcharts). For example, decimal point separator ('.' or ','). Useful tip: `import('highcharts/highcharts').Options` to get intellisense suggestions |

The above options can also be provided as *props* to the highcharts components. When provided as props, the props will be used instead. Module options are useful when you want the same feature applied globally, like exporting. Props are preferred when you only want to have those options affect individual components.

## Components
The nuxt-highchart module adds a plugin which registers the following components:

| Name | Description |
| --- | --- |
| `highchart` | The basic chart component (but still very powerful! see the demo) |
| `highstock` | The highstock chart component, shorthand for `<highchart :modules="['stock']" /> |
| `highmap` | The highmap chart component, shorthand for `<highchart :modules="['map']" /> |

### Props (extends and overrides [module options](#module-options))

| Option | Type | Default |  Description |
| ---| --- | --- | --- |
| `animation` | Object | `{}` | Animation options [Chart.update](https://api.highcharts.com/class-reference/Highcharts.Chart#update). This is where you can specify animation duration. |
|`exporting` | Boolean | `moduleOptions.exporting || false` |Enable/disable the exporting feature globally |
| `highcharts` | Object | `Highcharts` | The `Highcharts` instance to use, defaults to an instance imported by the plugin.
| `map` | Object | `{ mapName: 'myMapName', mapData: [world.geo.json from https://unpkg.com/@highcharts/map-collection@1.1.3/custom/world.geo.json] } ` | Options for the [Highmap chart](https://www.highcharts.com/maps/demo). The `mapData` can be either the JSON or string pointing to the json file |
| `modules` | Array\<String\> | Highcharts modules to load. These modules are in `node_modules/highcharts/modules/*.js` |
| `more` | Boolean | false | Enable/disable highcharts-more. Some charts, such as polar and bubble, require this to be enabled. NOTE: Highcharts library deliberately leaves out the features to avoid bloating the library. Only specify `more` when you want those extra features |
| `oneToOne` | Boolean | `true` | One-to-One option for [Chart.update](https://api.highcharts.com/class-reference/Highcharts.Chart#update) |
| `options` | Object | `moduleOptions.chartOptions || {}` | Default chart options to use for the highchart components. These get wired to [Highcharts](https://api.highcharts.com/highcharts). Useful tip: `import('highcharts/highcharts').Options` to get intellisense suggestions |
| `redraw` | Boolean | `true` | Redraw option for [Chart.update](https://api.highcharts.com/class-reference/Highcharts.Chart#update) |
| `setOptions` | Object | `moduleOptions.setOptions` | Options to use globally, that get sent to [Highcharts.setOptions](https://api.highcharts.com/highcharts). For example, decimal point separator ('.' or ','). Useful tip: `import('highcharts/highcharts').Options` to get intellisense suggestions |
| `update` | Array | `["options"]` | Contains an array of specific options to watch. Is extremely useful for speeding up the reactivity! Default: ["options"]. 

The following watchers are currently supported: 
  * "options": watch *deep* all the options' properties. Easy to use, but can impact performance.
  * "options.caption"
  * "options.series"
  * "options.subtitle"
  * "options.title"
  * "options.yAxis"
  * "options.xAxis" 


The plugin will also inject `$highcharts` into the current context, so that on any component, you can access the following properties:
* `$highcharts.chartTypes` - various chart types
* `$highcharts.components` - the components registered by the plugin

### Events

| Event | Description |
| --- | --- |
| `chartLoaded` | Emitted after successfully mounting any of the above components. It will provide an instance of the chart, so should you wish to use the Highchart API directly you can using that instance. |

### Run-time config

The following run-time config variables are also available in `this.$config.nuxtHighcharts`:

| Variable | Description |
| --- | --- |
| pluginOptions | The module options that were passed to the plugin |
| hcModNames | List of the highcharts modules you can load |

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Richard Schloss <richard.e.schloss@protonmail.com>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-highcharts
[npm-version-href]: https://npmjs.com/package/nuxt-highcharts

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-highcharts.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-highcharts

[github-actions-ci-src]: https://github.com/richardeschloss/nuxt-highcharts/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/richardeschloss/nuxt-highcharts/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/richardeschloss/nuxt-highcharts.svg
[codecov-href]: https://codecov.io/gh/richardeschloss/nuxt-highcharts

[license-src]: https://img.shields.io/npm/l/nuxt-highcharts.svg
[license-href]: https://npmjs.com/package/nuxt-highcharts
