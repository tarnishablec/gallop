import { ReactiveElement } from './component'
import { resetDirtyMap } from './reactive'
import { effectQueueMap, resolveEffects, resetLastHookEl } from './hooks'

export class Looper {
  protected static updateQueue = new Set<ReactiveElement>()
  protected static current?: ReactiveElement
  protected static dirty = false

  private constructor() {}

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
        resolveEffects(effectQueueMap.get(instance))
      })
      resetDirtyMap()
      Looper.dirty = false
      Looper.setCurrent(undefined)
      resetLastHookEl()
      Looper.updateQueue.clear()
    })
  }
}
