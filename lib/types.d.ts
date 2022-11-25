import { Options } from 'highcharts/highcharts'

// Important note: as of 12/2020 it seems...
// per the API docs, the "setOptions" get passed to the "Highcharts.setOptions" method
// while the chartOptions would get passed to the *Highcharts.chart* method

export { Options as ChartOptions }

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

declare type NuxtHighcharts = {
  chartTypes: Array<String>;
  components: Array<{ name: String, variant: String }>  
}

declare module "#app" {
  interface NuxtApp {
    $highcharts: NuxtHighcharts
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $highcharts: NuxtHighcharts
  }
}