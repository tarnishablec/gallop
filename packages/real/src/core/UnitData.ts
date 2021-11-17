import { ICloneable, IEquatable } from '@real/utils/able'
import { DataType } from './Datatype'

export class UnitData<T>
  implements IEquatable<UnitData<T>>, ICloneable<UnitData<T>>
{
  protected _value: T
  constructor(
    public dataType: DataType<T>,
    protected val?: typeof dataType['defaultValue']
  ) {
    this._value = val ?? dataType.defaultValue
  }

  get value(): T {
    return this._value
  }

  // set value(val: T) {
  //   this._value = val
  // }

  equalsTo(target: UnitData<T>): boolean {
    return (
      this.dataType.inputType === target.dataType.inputType &&
      this.dataType.equalFn(this._value, target._value)
    )
  }
  clone(): UnitData<T> {
    const data = new UnitData(this.dataType)
    data._value = this.dataType.cloneFn(this._value)
    return data
  }
}
