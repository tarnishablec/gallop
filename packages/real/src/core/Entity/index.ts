import { v4 } from 'uuid'
import type { Component } from '../Component'
import type { Class } from '@real/utils/type'
import { classOf } from '@real/utils/helper'
import { DoAble } from '@real/utils/mixin'

export class Entity extends DoAble() {
  public readonly id = v4()
  protected readonly components = new Map<Class<Component>, Component>()

  attachComponent<T extends Component>(component: T) {
    this.components.set(classOf(component), component)
  }

  removeComponent<T extends Component>(component: T): void
  removeComponent<T extends Component>(clazz: Class<T>): void
  removeComponent<T extends Component>(componentOrClass: T | Class<T>): void {
    let key: Class<T>
    if (typeof componentOrClass === 'function') {
      key = componentOrClass
    } else {
      key = classOf(componentOrClass)
      if (this.components.get(key) !== componentOrClass) return
    }
    this.components.delete(key)
  }
}
