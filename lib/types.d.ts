import { Options } from 'highcharts/highcharts'

// Important note: as of 12/2020 it seems...
// per the API docs, the "setOptions" get passed to the "Highcharts.setOptions" method
// while the chartOptions would get passed to the *Highcharts.chart* method

export type ModuleOptions = {
  chartOptions?: Options;
  exporting?: Boolean;
  setOptions?: Options;
}

declare module "@nuxt/schema" {
  interface NuxtConfig {
    highcharts?: ModuleOptions;  
  }

  interface NuxtOptions {
    highcharts?: ModuleOptions;
  }
}