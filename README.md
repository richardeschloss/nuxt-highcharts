# nuxt-highcharts

[![npm version][npm-version-src]][npm-version-href]
[![npm](https://img.shields.io/npm/dt/nuxt-highcharts)](https://www.npmjs.com/package/nuxt-highcharts)
[![](https://gitlab.com/richardeschloss/nuxt-highcharts/badges/master/pipeline.svg)](https://gitlab.com/richardeschloss/nuxt-highcharts)
[![](https://gitlab.com/richardeschloss/nuxt-highcharts/badges/master/coverage.svg)](https://gitlab.com/richardeschloss/nuxt-highcharts)
[![License][license-src]][license-href]

> Highcharts for Nuxt

STATUS: demo works, but this readme will be updated soon. Tests are created but not complete and not plugged into CI / CD yet...

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `nuxt-highcharts` dependency to your project

```bash
yarn add nuxt-highcharts # or npm install nuxt-highcharts
```

2. Add `nuxt-highcharts` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'nuxt-highcharts',

    // With options
    ['nuxt-highcharts', { /* module options */ }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Richard Schloss <richard.e.schloss@gmail.com>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-highcharts/latest.svg
[npm-version-href]: https://npmjs.com/package/nuxt-highcharts

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-highcharts.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-highcharts

[github-actions-ci-src]: https://github.com/richardeschloss/nuxt-highcharts/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/richardeschloss/nuxt-highcharts/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/richardeschloss/nuxt-highcharts.svg
[codecov-href]: https://codecov.io/gh/richardeschloss/nuxt-highcharts

[license-src]: https://img.shields.io/npm/l/nuxt-highcharts.svg
[license-href]: https://npmjs.com/package/nuxt-highcharts
