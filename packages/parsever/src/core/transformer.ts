import { PreparedParser } from './parser'

export abstract class Transformer<
  Layer,
  T extends readonly string[],
  Result extends Record<T[number], unknown> = Record<T[number], unknown>
> {
  parser?: PreparedParser<Layer, T>
  abstract readonly transforms: {
    [K in T[number]]: (layer: Layer, parser?: this['parser']) => Result[K]
  }
}
