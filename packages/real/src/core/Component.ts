import type { ICloneable, IEquatable } from './index'

export class Component<
  T extends Record<string, IEquatable<unknown> & ICloneable<unknown>>
> implements IEquatable<Component<T>>, ICloneable<Component<T>>
{
  constructor(protected data: T) {}

  equalsTo(target: Component<T>): boolean {
    if (Object.keys(this.data).length !== Object.keys(target.data).length) {
      return false
    }
    for (const key in this.data) {
      const entry = this.data[key]
      if (!entry.equalsTo(target.data[key])) {
        return false
      }
    }
    return true
  }

  clone(): Component<T> {
    const data = Object.entries(this.data).reduce((acc, [key, val]) => {
      Reflect.set(acc, key, val.clone())
      return acc
    }, {} as T)
    return new Component(data)
  }
}
