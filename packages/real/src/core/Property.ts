import { ICloneable, IEquatable } from './index'
import { NUMBER_TYPE } from './Datatype'
import { UnitData } from './UnitData'

export class Property implements IEquatable<Property>, ICloneable<Property> {
  constructor(
    public name: string,
    public unitData = new UnitData(NUMBER_TYPE)
  ) {}

  equalsTo(target: IEquatable<Property>): boolean {
    throw new Error('Method not implemented.')
  }
  clone(): ICloneable<Property> {
    throw new Error('Method not implemented.')
  }
}
