export type DefinerCheckeFn<Layer> = (layer: Layer) => boolean | string | void

export abstract class Definer<
  Layer,
  SupportedLayerTypes extends readonly string[]
> {
  abstract readonly defines: Record<
    SupportedLayerTypes[number],
    DefinerCheckeFn<Layer>
  >

  getSupportedLayerTypes() {
    return Object.keys(this.defines) as unknown as SupportedLayerTypes
  }
}
