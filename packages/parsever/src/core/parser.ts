import { type UnionToTuple, type Flatten, assertType } from '../utils'
import { LayerDefiner, type DefinerCheckeFn } from './definer'

export class Parser<Layer> {
  constructor() {}

  public definersMap: Record<string, DefinerCheckeFn<Layer>> = {}

  supportedLayerTypes: unknown = []

  public useDefiner<T extends readonly LayerDefiner<Layer, any>[]>(
    ...definers: T
  ): DefinedParser<Layer, ConcatSupported<Layer, this, T>> {
    for (const definer of definers) {
      Object.assign(this.definersMap, definer.defineMapping)
    }
    this.supportedLayerTypes = Object.keys(this.definersMap)
    assertType<DefinedParser<Layer, ConcatSupported<Layer, this, T>>>(this)
    return this
  }
}

export abstract class DefinedParser<
  Layer,
  T extends unknown[]
> extends Parser<Layer> {
  abstract override supportedLayerTypes: T
}

export abstract class PreparedParser<
  Layer,
  T extends unknown[]
> extends DefinedParser<Layer, T> {}

type ConcatSupported<Layer, P extends Parser<Layer>, T> = UnionToTuple<
  [
    ...(P['supportedLayerTypes'] extends readonly string[]
      ? [...P['supportedLayerTypes']]
      : []),
    ...Flatten<{
      [K in keyof T]: T[K] extends LayerDefiner<Layer, infer U> ? U : never
    }>
  ][number]
>
