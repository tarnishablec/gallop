import { ReactiveElement } from './component'
import { createProxy } from './reactive'

export type ContextOption<T extends object> = {
  updated?: (value: T, context: Context<T>) => unknown
  created?: (raw: T, context: Context<T>) => unknown
  hooked?: (value: T, context: Context<T>, el: ReactiveElement) => unknown
  [key: string]: unknown
}

export class Context<T extends object> {
  proxy: [T, Context<T>]
  watchedInstances: Set<ReactiveElement> = new Set()

  constructor(public raw: T, public option?: ContextOption<T>) {
    this.raw = raw
    this.proxy = [createProxy(this.raw, { onSet: () => this.update() }), this]
    this.option?.created?.(this.raw, this)
  }

  watch(element: ReactiveElement) {
    this.watchedInstances.add(element)
    this.option?.hooked?.(this.proxy[0], this, element)
  }

  unWatch(element: ReactiveElement) {
    this.watchedInstances.delete(element)
  }

  update() {
    this.watchedInstances.forEach((instance) => {
      instance.requestUpdate()
    })
    this.option?.updated?.(this.proxy[0], this)
  }
}

export function createContext<T extends object>(
  raw: T,
  option?: ContextOption<T>
) {
  return new Context(raw, option).proxy
}
