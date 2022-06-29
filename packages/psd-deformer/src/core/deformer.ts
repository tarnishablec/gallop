import { type Psd } from 'ag-psd'
import { type UnionToTuple, type Flatten } from '../utils'
import { PsdLayerDefiner, type DefinerCheckeFn } from './definer'

function assertType<T>(a: any): asserts a is T {}

export class PsdDeformer {
  constructor(public psd?: Psd) {}

  protected definers: PsdLayerDefiner<any>[] = []

  public definersMap: Record<string, DefinerCheckeFn> = {}

  supportedLayerTypes: unknown = []

  public useDefiner<T extends readonly PsdLayerDefiner<any>[]>(
    ...definers: T
  ): DefinedPsdDeformer<ConcatSupported<this, T>> {
    this.definers.push(...definers)
    for (const definer of definers) {
      Object.assign(this.definersMap, definer.defineMapping)
    }
    this.supportedLayerTypes = Object.keys(this.definersMap)
    assertType<DefinedPsdDeformer<ConcatSupported<this, T>>>(this)
    return this
  }
}

export abstract class DefinedPsdDeformer<
  T extends unknown[]
> extends PsdDeformer {
  abstract override supportedLayerTypes: T
}

type ConcatSupported<P extends PsdDeformer, T> = UnionToTuple<
  [
    ...(P['supportedLayerTypes'] extends readonly string[]
      ? [...P['supportedLayerTypes']]
      : []),
    ...Flatten<{
      [K in keyof T]: T[K] extends PsdLayerDefiner<infer U> ? U : never
    }>
  ][number]
>
