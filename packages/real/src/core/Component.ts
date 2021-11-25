import type { ICloneable } from '@real/utils/able'
import type { Property } from './Property'
import { DoAble } from '@real/utils/mixin'

export abstract class Component
  extends DoAble()
  implements ICloneable<Component>
{
  /** https://stackoverflow.com/questions/65129070/defining-an-array-of-differing-generic-types-in-typescript */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract properties: readonly Property<string, any, any>[]

  get name(): string {
    return this.constructor.name
  }

  clone(): this {
    const comp = Object.create(this) as this
    comp.properties = this.properties.map((v) => v.clone())
    return comp
  }
}

// export function draftlize(this: Component): ComponentDraft<T> {
//   const result = {} as ComponentDraft<T>
//   return result
// }
