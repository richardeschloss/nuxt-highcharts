import { copyFileSync, unlinkSync } from 'fs'
const contexts = {
  prod: './highcharts/contexts.js',
  backup: './highcharts/contexts.js.bak',
  mocks: './test/mocks/contexts.js'
}

export function prepareMocks() {
  copyFileSync(contexts.prod, contexts.backup)
  copyFileSync(contexts.mocks, contexts.prod)  
}

export function cleanMocks() {
  copyFileSync(contexts.backup, contexts.prod)
  unlinkSync(contexts.backup)
}