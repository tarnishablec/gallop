import { ICloneable, IEquatable } from './index'
import { UnitData } from './UnitData'

export class Property<T>
  implements IEquatable<Property<T>>, ICloneable<Property<T>>
{
  constructor(public name: string, public unitData: UnitData<T>) {}

  equalsTo(target: Property<T>): boolean {
    return this.unitData.equalsTo(target.unitData)
  }
  clone(): Property<T> {
    return new Property(this.name, this.unitData.clone())
  }
}
