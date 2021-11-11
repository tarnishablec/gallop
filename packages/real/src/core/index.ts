export interface IEquatable<T> {
  equalsTo(target: T): boolean
}

export interface ICloneable<T> {
  clone(): T
}

export type Primitive =
  | boolean
  | number
  | undefined
  | null
  | string
  | bigint
  | symbol
