import { COMPLEX_TYPE } from '../DataType'

export class DataType<V> {
  name: string

  constructor(
    public readonly inputType: COMPLEX_TYPE,
    public readonly defaultValue: V,
    public readonly equalFn: (a: V, b: V) => boolean = (a, b) => a === b,
    public readonly cloneFn: (val: V) => V = (val) => val
  ) {
    this.name = inputType.toString()
  }
}
