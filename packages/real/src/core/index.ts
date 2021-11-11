export interface IEquatable<T> {
  equalsTo(target: IEquatable<T>): boolean
}

export interface ICloneable<T> {
  clone(): ICloneable<T>
}

export type Primitive =
  | boolean
  | number
  | undefined
  | null
  | string
  | bigint
  | symbol
