import { ReactiveElement } from './component'
import { createProxy } from './reactive'

export type ContextOption<T extends object> = {
  updated?: (v: T) => unknown
  created?: (v: T) => unknown
  hooked?: (v: T, el: ReactiveElement<any>) => unknown
  [key: string]: unknown
}

export class Context<T extends object> {
  proxy: [T, Context<T>]
  watchedInstances: Set<ReactiveElement<any>> = new Set()

  constructor(public raw: T, public option?: ContextOption<T>) {
    this.raw = raw
    this.proxy = [createProxy(this.raw, () => this.update()), this]
    this.option?.created?.(this.raw)
  }

  watch(element: ReactiveElement<any>) {
    this.watchedInstances.add(element)
    this.option?.hooked?.(this.proxy[0], element)
  }

  unWatch(element: ReactiveElement<any>) {
    this.watchedInstances.delete(element)
  }

  update() {
    this.watchedInstances.forEach((instance) => {
      instance.requestUpdate()
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
