import { ICloneable, IEquatable } from '.'
import { DataType } from './Datatype'

export class UnitData<V>
  implements IEquatable<UnitData<V>>, ICloneable<UnitData<V>>
{
  protected _value: V
  constructor(public dataType: DataType<V>) {
    this._value = dataType.defaultValue
  }

  get value(): V {
    return this._value
  }

  set value(val: V) {
    this._value = val
  }

  equalsTo(target: UnitData<V>): boolean {
    return (
      this.dataType.type === target.dataType.type &&
      this._value === target._value
    )
  }
  clone(): UnitData<V> {
    const data = new UnitData(this.dataType)
    data._value = this._value
    return data
  }
}
