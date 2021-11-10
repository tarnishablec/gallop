import { v4 } from 'uuid'

export abstract class Entity<T> {
  protected readonly id = new UniqueEntityID()
  protected readonly props: T
  public equals(entity: Entity<T>) {
    return entity.id === this.id
  }
  constructor(props: T) {
    this.props = props
  }
}

export class UniqueEntityID {
  protected value: string = v4()
  public equals(id: UniqueEntityID) {
    return id.value === this.value
  }
}
