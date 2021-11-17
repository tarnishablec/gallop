import type { ICloneable } from '@real/utils/able'
import type { Property } from './Property'

export abstract class Component implements ICloneable<Component> {
  /** https://stackoverflow.com/questions/65129070/defining-an-array-of-differing-generic-types-in-typescript */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract properties: ReadonlyArray<Property<any, any>>

  get name(): string {
    return this.constructor.name
  }

  clone(): Component {
    const comp = Object.create(this) as Component
    comp.properties = this.properties.map((v) => v.clone())
    return comp
  }
}

export abstract class ShareComponent {
  // TODO
}
