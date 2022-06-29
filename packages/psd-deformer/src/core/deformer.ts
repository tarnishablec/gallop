import { type Psd } from 'ag-psd'
import { RichTextLayerDefiner } from 'packages/playground/src/psd/parser'
import { BasePsdLayerDefiner } from '../base/baseDefiner'
import { PsdLayerDefiner, type DefinerCheckeFn } from './definer'

export class PsdDeformer {
  constructor(public psd?: Psd) {}

  protected definers: PsdLayerDefiner<any>[] = []

  protected definersMap: Record<string, DefinerCheckeFn> = {}

  getSupportedLayerTypes: unknown = () => Object.keys(this.definersMap)

  public useDefiner<T extends readonly PsdLayerDefiner<any>[]>(
    ...definers: T
  ): this is {
    getSupportedLayerTypes: () => [
      ...Flatten<{
        [K in keyof T]: T[K] extends PsdLayerDefiner<infer U> ? U : never
      }>
    ]
  } & this {
    this.definers.push(...definers)
    for (const definer of definers) {
      Object.assign(this.definersMap, definer.defineMapping)
    }

    return true
  }
}

export type Class<T> = new (...args: any[]) => T

type Flatten<T, R extends unknown[] = []> = T extends [
  infer FIRST,
  ...infer REST
]
  ? FIRST extends readonly unknown[]
    ? Flatten<[...FIRST, ...REST], R>
    : Flatten<REST, [...R, FIRST]>
  : R
