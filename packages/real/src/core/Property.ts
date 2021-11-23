import type { ICloneable } from '@real/utils/able'
import type { UnitData } from './UnitData'

export class Property<N extends string, T, M = void>
  implements ICloneable<Property<N, T, M>>
{
  constructor(
    public name: N,
    public data: UnitData<T>,
    public readonly meta: M = void 0 as unknown as M
  ) {}

  clone(): Property<N, T, M> {
    return new Property(this.name, this.data.clone(), this.meta)
  }
}
