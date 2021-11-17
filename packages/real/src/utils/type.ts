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
