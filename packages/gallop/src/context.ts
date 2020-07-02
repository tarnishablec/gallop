import { Obj } from './utils'
import { createProxy } from './reactive'
import { ReactiveElement } from './component'

export type ContextOptions<T extends Obj> = Partial<{
  onCreate: (context: Context<T>) => unknown
  onUpdate: (context: Context<T>) => unknown
  onWatch: (context: Context<T>, el: ReactiveElement) => unknown
  onUnwatch: (context: Context<T>, el: ReactiveElement) => unknown
}>

export class Context<T extends Obj> {
  proxy: T
  watchList: Set<ReactiveElement> = new Set()

  constructor(public raw: T, public options?: ContextOptions<T>) {
    this.proxy = createProxy(raw, { onMut: () => this.update() })
    options?.onCreate?.(this)
  }

  update() {
    this.watchList.forEach((el) => el.requestUpdate())
    this.options?.onUpdate?.(this)
  }

  static globalContext?: Context<Obj>
  static global?: Obj
  static initGlobal<G extends Obj>(init: G, options?: ContextOptions<G>) {
    if (Context.globalContext || Context.global) {
      throw new Error(`Can not init global context twice.`)
    }
    return ([Context.global, Context.globalContext as unknown] = createContext(
      init,
      options
    ))
  }

  watch(el: ReactiveElement) {
    this.watchList.add(el)
    el.$contexts.add(this as Context<Obj>)
    this.options?.onWatch?.(this, el)
  }

  unwatch(el: ReactiveElement) {
    this.watchList.delete(el)
    el.$contexts.delete(this as Context<Obj>)
    this.options?.onUnwatch?.(this, el)
  }
}

export const createContext = <T extends Obj>(
  raw: T,
  options?: ContextOptions<T>
): [T, Context<T>] => {
  const context = new Context(raw, options)
  return [context.proxy, context]
}
