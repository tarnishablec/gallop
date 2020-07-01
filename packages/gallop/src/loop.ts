import { ReactiveElement } from './component'
import { resetDirtyCollectionSet } from './reactive'
import { resolveEffects, unmountEffectMap, resetLastDepEl } from './hooks'

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

  static loopEachCallbacks = new Map<
    string,
    (current: ReactiveElement) => unknown
  >()
  static loopEndCallbacks = new Map<string, () => void>()

  static flush() {
    if (Looper.dirty) return
    Looper.dirty = true
    Promise.resolve().then(() => {
      Looper.updateQueue.forEach((instance) => {
        Looper.setCurrent(instance)
        instance.dispatchUpdate()
        Looper.loopEachCallbacks.forEach((cb) => cb(instance))
      })
      Looper.setCurrent(undefined)
      Looper.dirty = false
      Looper.updateQueue.clear()
      Looper.loopEndCallbacks.forEach((cb) => cb())
    })
  }
}

Looper.loopEndCallbacks.set('resetLastDepEl', resetLastDepEl)
Looper.loopEndCallbacks.set('resetDirtyCollectionSet', resetDirtyCollectionSet)
Looper.loopEachCallbacks.set('resolveEffects', (current) =>
  resolveEffects(current)?.then((res) =>
    unmountEffectMap.set(current, res.filter(Boolean) as (() => void)[])
  )
)
