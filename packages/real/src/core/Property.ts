import { ICloneable } from '@real/utils/able'
import { UnitData } from './UnitData'

export class Property<T, M = void> implements ICloneable<Property<T, M>> {
  constructor(
    public name: string,
    protected data: UnitData<T>,
    public readonly meta: M = void 0 as unknown as M
  ) {}

  clone(): Property<T, M> {
    return new Property(this.name, this.data.clone(), this.meta)
  }
}
