import type { Obj } from './utils'
import { createProxy } from './reactive'
import type { ReactiveElement } from './component'

export type ContextOptions<T extends Obj = Obj> = Partial<{
  beforeCreate: (this: Context<T>) => unknown
  onCreate: (this: Context<T>) => unknown
  onUpdate: (this: Context<T>) => unknown
  onWatch: (this: Context<T>, el: ReactiveElement) => unknown
  onUnwatch: (this: Context<T>, el: ReactiveElement) => unknown
  [key: string]: unknown
}>

export class Context<T extends Obj = Obj> {
  data: T
  private watchList: Set<ReactiveElement> = new Set()

  constructor(public raw: T, public options?: ContextOptions<T>[]) {
    options?.forEach((v) => v.beforeCreate?.call(this))
    this.data = createProxy(this.raw, { onMut: () => this.update() })
    options?.forEach((v) => v.onCreate?.call(this))
  }

  update() {
    this.watchList.forEach((el) => el.requestUpdate())
    this.options?.forEach((v) => v.onUpdate?.call(this))
  }

  watch(el: ReactiveElement) {
    this.watchList.add(el)
    el.$contexts.add(this as Context)
    this.options?.forEach((v) => v.onWatch?.call(this, el))
  }

  unwatch(el: ReactiveElement) {
    this.watchList.delete(el)
    this.options?.forEach((v) => v.onUnwatch?.call(this, el))
  }
}

export const createContext = <T extends Obj>(
  raw: T,
  options?: ContextOptions<T>[]
) => {
  return new Context(raw, options)
}
