import { ReactiveElement } from './component'

export class Looper {
  protected static updateQueue = new Set<ReactiveElement>()
  protected static current?: ReactiveElement
  protected static dirty = false

  private constructor() {}

  static resolveCurrent() {
    return Looper.current
  }

  static setCurrent(el: ReactiveElement) {
    Looper.current = el
  }

  static enUpdateQueue(el: ReactiveElement) {
    Looper.updateQueue.add(el)
    Looper.flush()
  }

  static flush() {
    if (Looper.dirty) {
      return
    }
    Looper.dirty = true
    requestAnimationFrame(() => {
      Looper.updateQueue.forEach((instance) => {
        Looper.setCurrent(instance)
        instance.dispatchUpdate()
      })
    })
  }
}
