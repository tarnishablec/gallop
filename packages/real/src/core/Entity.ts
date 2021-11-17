import { v4 } from 'uuid'
import { Component } from './Component'

export class Entity {
  public readonly id = v4()
  protected readonly components = new Map<string, Component>()

  attachComponent(component: Component) {
    this.components.set(component.name, component)
  }

  removeComponent(name: string): void
  removeComponent(component: Component): void
  removeComponent(componentOrName: Component | string): void {
    const key =
      componentOrName instanceof Component
        ? componentOrName.name
        : componentOrName
    this.components.delete(key)
  }
}
