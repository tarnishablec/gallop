import type { Component } from '@real/core/Component'
import { Property } from '@real/core/Property'

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

export type Class<T> = new (...args: any[]) => T

export type ComponentKey<T extends Component> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T['properties'] extends readonly Property<infer K, any, any>[] ? K : never
