export type DefinerCheckeFn<Layer> = (layer: Layer) => boolean | string | void

export abstract class LayerDefiner<
  Layer,
  SupportedLayerTypes extends readonly string[]
> {
  abstract readonly defineMapping: Readonly<
    Record<SupportedLayerTypes[number], DefinerCheckeFn<Layer>>
  >

  getSupportedLayerTypes() {
    return Object.keys(this.defineMapping) as unknown as SupportedLayerTypes
  }
}
