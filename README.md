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

```bash
yarn add nuxt-highcharts # or npm install nuxt-highcharts
```

- These are the module's *required* dependencies:
  *  [highcharts](https://www.npmjs.com/package/highcharts) - The charting library.

- These are the module's *optional* dependencies:
  * [@highcharts/map-collection](https://www.npmjs.com/package/@highcharts/map-collection) - Collection of maps to use with Highmap. Please be aware of their [LICENSE](https://github.com/highcharts/map-collection-dist/blob/master/LICENSE.md). This module uses it strictly for demo purposes (and is non-profit, open-source). 


NOTE: if you chose *not* to install the optional dependencies, you will most likely want to use webpack's [`ignorePlugin`](https://webpack.js.org/plugins/ignore-plugin/) to ignore the missing dependency. Otherwise, you'll be faced with either build warnings or errors.

In nuxt.config, you would just need to add:

```
import webpack from 'webpack' // npm i -D webpack 

module.exports = {
  ...
  build: {
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /\@highcharts\/map\-collection/
      })
    ],
  }
  ...
}
```

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

### Module Options

* `chartOptions` - [Object] Default chart options to use for the highchart components.
* `exporting` - [Boolean] Enable/disable the exporting feature globally
* `mapChart` - [Object] Default options for the [Highmap chart](https://www.highcharts.com/maps/demo)
  * `mapName` - [String] name to use for the mapChat, default: "myMapName"
  * `mapData` - [Object] data to use for the map, default: [worldmap.json](https://unpkg.com/@highcharts/map-collection@1.1.3/custom/world.geo.json)

The above options can also be provided as *props* to the highcharts components. When provided as props, the props will be used instead. The demo passes most options, except exporting, as props since different components will have different requirements.Some options you may want to be applied globally however.

## Usage

### Module
The module adds a plugin which registers the following components:
1. `highchart` - The basic chart component (but still very powerful! see the demo)
2. `highstock` - The highstock chart component
3. `highmap` - The highmap chart component   
4. `sunburst` - The sunburst chart

The `highstock` and `highmap` components are simply variants of the basic `highchart` component which accepts the following props:

* `highcharts` - [Object] The `Highcharts` instance to use, default: `Highcharts` imported by the plugin (from node_modules/highcharts).
* `options` - [Object] The `chartOptions` to use, default: `moduleOptions.chartOptions`. (Heads up: Might get renamed to `chartOptions` someday)
* `redraw` - [Boolean] Redraw option for [Chart.update](https://api.highcharts.com/class-reference/Highcharts.Chart#update)
* `oneToOne` - [Boolean] One-to-One option for [Chart.update](https://api.highcharts.com/class-reference/Highcharts.Chart#update) 
* `animation` - [Object] Animation options [Chart.update](https://api.highcharts.com/class-reference/Highcharts.Chart#update). This is where you can specify animation duration.
* `exporting` - [Boolean] Enable / disable exporting. NOTE: the *module options* for exporting are applied to the default Highchart instance. If you wish to apply different exporting setting to a specific chart, this is a case where you'd have to pass in your own highcharts instance using the "highcharts" prop.
* `update` - [Array] Contains an array of specific options to watch. Is extremely useful for speeding up the reactivity! Default: ["options"]. The following watchers are currently supported:
  * "options": watch *deep* all the options' properties. Easy to use, but can impact performance.
  * "options.caption"
  * "options.series"
  * "options.subtitle"
  * "options.title"
  * "options.yAxis"
  * "options.xAxis"
  

The `highmap` component also adds the following prop:
* `mapChart` - S/A module options

The plugin will also inject `$highcharts` into the current context, so that on any component, you can access the following properties:
* `$highcharts.chartTypes` - various chart types
* `$highcharts.components` - the components registered by the plugin
* `$highcharts.variants` - the variant names for the components; probably extraneous, but is used by the demo to auto generate the navbar links. 

### Events
* `chartLoaded` - emitted after successfully mounting any of the above components. It will provide an instance of the chart, so should you wish to use the Highchart API directly you can using that instance.

## Examples:

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
