import { ReactiveElement } from './component'

export class Looper {
  private constructor() {}

  protected static updateQueue = new Set<ReactiveElement>()
  protected static current?: ReactiveElement
  protected static dirty = false

  static resolveCurrent() {
    return Looper.current!
  }

  static setCurrent(el: ReactiveElement | undefined) {
    Looper.current = el
  }

  static enUpdateQueue(el: ReactiveElement) {
    Looper.updateQueue.add(el)
    Looper.flush()
  }

  static flush() {
    if (Looper.dirty) return
    Looper.dirty = true
    requestAnimationFrame(() => {
      Looper.updateQueue.forEach((instance) => {
        Looper.setCurrent(instance)
        instance.dispatchUpdate()
      })
      Looper.setCurrent(undefined)
      Looper.dirty = false
      Looper.updateQueue.clear()
    })
  }
}
