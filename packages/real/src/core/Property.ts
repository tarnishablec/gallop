import { ICloneable, IEquatable } from './index'
import { NUMBER_TYPE } from './Datatype'
import { UnitData } from './UnitData'

export class Property implements IEquatable<Property>, ICloneable<Property> {
  constructor(
    public name: string,
    public unitData = new UnitData(NUMBER_TYPE)
  ) {}

  equalsTo(target: Property): boolean {
    return this.unitData.equalsTo(target.unitData)
  }
  clone(): Property {
    return new Property(this.name, this.unitData.clone())
  }
}
