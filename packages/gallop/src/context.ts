import { ReactiveElement } from './component'
import { createProxy } from './reactive'

export class Context<T extends object> {
  raw: T
  proxy: [T, Context<T>]
  watchedInstances: Set<ReactiveElement> = new Set()

  constructor(raw: T) {
    this.raw = raw
    this.proxy = [createProxy(this.raw, () => this.update()), this]
  }

  watch(element: ReactiveElement) {
    this.watchedInstances.add(element)
  }

  unWatch(element: ReactiveElement) {
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
