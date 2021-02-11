import { parse as pParse } from 'path'
function hcModsContext(fName) {
  const { name } = pParse(fName)
  return function(hc) {
    hc._modules[`masters/modules/${name}.src.js`] = true
    if (name === 'map') {
      hc.maps = {
        myMapName: true
      }
    }
  }
}
hcModsContext.keys = () => [
  'heatmap.src.js',
  'heatmap.js',
  'map.src.js',
  'map.js',
  'sunburst.src.js',
  'sunburst.js',
] 

export {
  hcModsContext
}