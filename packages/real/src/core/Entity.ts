import { v4 } from 'uuid'
import { IEquatable } from './index'

export abstract class Entity<T> implements IEquatable<Entity<T>> {
  protected readonly id = v4()
  protected readonly props: T
  public equalsTo(entity: Entity<T>) {
    return this.id === entity.id
  }
  constructor(props: T) {
    this.props = props
  }
}

// export class UniqueEntityID implements IEquatable<UniqueEntityID> {
//   protected value: string = v4()
//   public equalsTo(id: UniqueEntityID) {
//     return id.value === this.value
//   }
// }
