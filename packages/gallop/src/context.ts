import { UpdatableElement } from './component'
import { createProxy } from './reactive'

export class Context<T extends object> {
  raw: T
  proxy: [T, Context<T>]
  watchedInstances: Set<UpdatableElement> = new Set()

  static namespace?: string //for persistence

  constructor(raw: T) {
    this.raw = raw
    this.proxy = [createProxy(this.raw, () => this.update()), this]
  }

  static setNamespace(name: string) {
    Context.namespace = name
  }

  watch(element: UpdatableElement) {
    this.watchedInstances.add(element)
  }

  unWatch(element: UpdatableElement) {
    this.watchedInstances.delete(element)
  }

  update() {
    this.watchedInstances.forEach((instance) => {
      instance.enUpdateQueue()
    })
  }
}

export function createContext<T extends object>(raw: T) {
  return new Context(raw).proxy
}
