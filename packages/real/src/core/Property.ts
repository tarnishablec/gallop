import type { ICloneable } from '@real/utils/able'
import type { UnitData } from './UnitData'

export class Property<N extends string, T>
  implements ICloneable<Property<N, T>>
{
  constructor(public readonly name: N, public data: UnitData<T>) {}

  clone(): Property<N, T> {
    return new Property(this.name, this.data.clone())
  }
}
