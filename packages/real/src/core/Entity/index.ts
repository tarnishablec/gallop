import { v4 } from 'uuid'
import type { Component } from '../Component'
import type { Class } from '@real/utils/type'
import { classOf } from '@real/utils/helper'
import { DoAble } from '@real/utils/mixin'

export class Entity extends DoAble() {
  public readonly id = v4()
  protected readonly components = new Map<Class<Component>, Component>()
}

export function attachComponent<T extends Component>(
  this: Entity,
  component: T
) {
  this.components.set(classOf(component), component)
}

export function removeComponent<T extends Component>(
  this: Entity,
  component: T
): void
export function removeComponent<T extends Component>(
  this: Entity,
  clazz: Class<T>
): void
export function removeComponent<T extends Component>(
  this: Entity,
  componentOrClass: T | Class<T>
): void {
  let key: Class<T>
  if (typeof componentOrClass === 'function') {
    key = componentOrClass
  } else {
    key = classOf(componentOrClass)
    if (this.components.get(key) !== componentOrClass) return
  }
  this.components.delete(key)
}
