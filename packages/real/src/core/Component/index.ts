import type { ICloneable } from '@real/utils/able'
import { DoAble } from '@real/utils/mixin'

export abstract class Component
  extends DoAble()
  implements ICloneable<Component>
{
  abstract name: string

  clone(): this {
    const comp = Object.create(this) as this
    return comp
  }
}

// export function draftlize(this: Component): ComponentDraft<T> {
//   const result = {} as ComponentDraft<T>
//   return result
// }

export class ComponentManager {
  private static instance: ComponentManager

  private constructor() {}

  static getInstance() {
    if (ComponentManager.instance) {
      return ComponentManager.instance
    }
    return (ComponentManager.instance = new ComponentManager())
  }
}

export const autowired: ClassDecorator = (target) => {
  const componentManager = ComponentManager.getInstance()
}
