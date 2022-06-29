import { type PsdLayer } from '../types'

export type DefinerCheckeFn = (layer: PsdLayer) => boolean | string | void

export abstract class PsdLayerDefiner<
  SupportedLayerTypes extends readonly string[]
> {
  abstract readonly defineMapping: Readonly<
    Record<SupportedLayerTypes[number], DefinerCheckeFn>
  >

  getSupportedLayerTypes() {
    return Object.keys(this.defineMapping) as unknown as SupportedLayerTypes
  }
}
