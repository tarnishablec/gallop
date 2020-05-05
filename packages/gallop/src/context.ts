import { ReactiveElement } from './component'
import { createProxy } from './reactive'

type ContextOption<T extends object> = {
  name?: string
  updated?: (v: T) => unknown
  created?: (v: T) => unknown
}

export class Context<T extends object> {
  proxy: [T, Context<T>]
  watchedInstances: Set<ReactiveElement> = new Set()

  constructor(public raw: T, public option?: ContextOption<T>) {
    this.raw = raw
    this.proxy = [createProxy(this.raw, () => this.update()), this]
    this.option?.created?.(this.raw)
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
    this.option?.updated?.(this.proxy[0])
  }
}

export function createContext<T extends object>(
  raw: T,
  option?: ContextOption<T>
) {
  return new Context(raw, option).proxy
}
