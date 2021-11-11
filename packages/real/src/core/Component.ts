import type { ICloneable } from './index'
import { Property } from './Property'

export abstract class Component implements ICloneable<Component> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract properties: ReadonlyArray<Property<any>>

  get name(): string {
    return this.constructor.name
  }

  clone(): Component {
    const comp = Object.create(this) as Component
    comp.properties = this.properties.map((v) => v.clone())
    return comp
  }
}
