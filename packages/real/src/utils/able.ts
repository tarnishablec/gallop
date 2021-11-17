export interface IEquatable<T> {
  equalsTo(target: T): boolean
}

export interface ICloneable<T> {
  clone(): T
}

export interface ISerializable {
  serialize(): string
}
