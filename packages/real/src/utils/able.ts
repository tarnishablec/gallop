export interface IEquatable<T> {
  equalsTo(target: T): boolean
}

export interface ICloneable<T> {
  clone(): T
}

export interface ISerializable {
  serialize(): string
}

export interface IDoAble {
  do<F extends (this: this, ...args: any[]) => ReturnType<F>>(
    func: F,
    ...args: any[]
  ): ReturnType<F>
}
