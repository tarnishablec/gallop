import { ICloneable, IEquatable } from '.'
import { DataType } from './Datatype'

export class UnitData<V>
  implements IEquatable<UnitData<V>>, ICloneable<UnitData<V>>
{
  private _value: V
  constructor(public type: DataType<V>) {
    this._value = type.defaultValue
  }

  get value(): V {
    return this._value
  }

  set value(val: V) {
    this._value = val
  }

  equalsTo(target: IEquatable<UnitData<V>>): boolean {
    throw new Error('Method not implemented.')
  }
  clone(): ICloneable<UnitData<V>> {
    throw new Error('Method not implemented.')
  }
}
