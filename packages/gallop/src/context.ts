import type { Obj } from './utils'
import { createProxy } from './reactive'
import type { ReactiveElement } from './component'

export type ContextOptions<T extends Obj = Obj> = Partial<{
  beforeCreate: (Context: Context<T>) => unknown
  onCreate: (context: Context<T>) => unknown
  onUpdate: (context: Context<T>) => unknown
  onWatch: (context: Context<T>, el: ReactiveElement) => unknown
  onUnwatch: (context: Context<T>, el: ReactiveElement) => unknown
  [key: string]: unknown
}>

export class Context<T extends Obj = Obj> {
  proxy: T
  watchList: Set<ReactiveElement> = new Set()

  constructor(public raw: T, public options?: ContextOptions<T>[]) {
    options?.forEach((v) => v.beforeCreate?.(this))
    this.proxy = createProxy(this.raw, { onMut: () => this.update() })
    options?.forEach((v) => v.onCreate?.(this))
  }

  update() {
    this.watchList.forEach((el) => el.requestUpdate())
    this.options?.forEach((v) => v.onUpdate?.(this))
  }

  watch(el: ReactiveElement) {
    this.watchList.add(el)
    el.$contexts.add(this as Context)
    this.options?.forEach((v) => v.onWatch?.(this, el))
  }

  unwatch(el: ReactiveElement) {
    this.watchList.delete(el)
    this.options?.forEach((v) => v.onUnwatch?.(this, el))
  }
}

export const createContext = <T extends Obj>(
  raw: T,
  options?: ContextOptions<T>[]
): [T, Context<T>] => {
  const context = new Context(raw, options)
  return [context.proxy, context]
}
