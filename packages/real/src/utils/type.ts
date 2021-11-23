/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Component } from '@real/core/Component'
import type { Property } from '@real/core/Property'

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

export type PropertyToRecord<T> = T extends Property<infer N, infer V, any>
  ? { readonly [k in N extends string ? N : never]: V }
  : never

export type PropertiesToRecord<T> = T extends readonly [infer I, ...infer R]
  ? Merge<PropertyToRecord<I>, R extends [] ? {} : PropertiesToRecord<R>>
  : never

export type ComponentDraft<T extends Component> = PropertiesToRecord<
  T['properties']
>
