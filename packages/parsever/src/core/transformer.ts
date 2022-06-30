export abstract class Transformer<Layer, T extends readonly string[]> {
  abstract readonly transforms: Record<T[number], (layer: Layer) => unknown>
}
