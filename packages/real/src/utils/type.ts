import type { Component } from '@real/core/Component'
import type { Property } from '@real/core/Property'
// import type { DeepReadonly } from 'utility-types'

export type Direction = 'horizontal' | 'vertical'

export type CornerLocation = ['left' | 'right', 'top' | 'bottom']

export type Primitive =
  | boolean
  | number
  | undefined
  | null
  | string
  | bigint
  | symbol

export type Merge<F extends object, S extends object> = {
  [K in keyof F | keyof S]: K extends keyof S
    ? S[K]
    : K extends keyof F
    ? F[K]
    : never
}

export type Class<T> = new (...args: any[]) => T

export type Instance<T> = T extends Class<infer I> ? I : never

export type PropertyToRecord<T> = T extends Property<infer N, infer V, infer M>
  ? {
      readonly [k in N extends string ? N : never]: {
        value: V
        readonly meta: M
      }
    }
  : never

export type PropertiesToRecord<T> = T extends readonly [infer I, ...infer R]
  ? Merge<PropertyToRecord<I>, R extends [] ? {} : PropertiesToRecord<R>>
  : never

export type ComponentDraft<T extends Component> = PropertiesToRecord<
  T['properties']
>

export type SelectorToDraft<T extends readonly Class<Component>[]> =
  readonly ComponentDraft<Instance<T[number]>>[]
