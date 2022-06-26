import { type Layer as PsdLayer } from 'ag-psd'
import { type ElementType } from './types'

export const resolvePsdLayerType = (layer: PsdLayer): ElementType => {
  if (layer.children) return 'Group'
  if (layer.text) return 'Text'
  return 'Image'
}
