import { ReactiveElement } from './component'
import { resolveEffects, unmountedEffectMap, resetLastDepEl } from './hooks'
import { Recycler } from './dirty'

export class Looper {
  private constructor() {}

  protected static current?: ReactiveElement
  static resolveCurrent = () => Looper.current!
  static setCurrent = (el: ReactiveElement | undefined) => (Looper.current = el)
  static enUpdateQueue = (el: ReactiveElement) =>
    Looper.updateQueue.add(el) && Looper.flush()

  static loopEachCallbacks = new Map<string, (current: ReactiveElement) => unknown>()
  static loopEndCallbacks = new Map<string, () => void>()

  protected static updateQueue = new Set<ReactiveElement>()
  protected static dirty = false
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

// Loop end
Looper.loopEndCallbacks.set('resetLastDepEl', resetLastDepEl)
Looper.loopEndCallbacks.set(
  'resetDirtyCollectionSet',
  Recycler.resetDirtyCollectionSet
)
// Loop each
Looper.loopEachCallbacks.set('resolveEffects', (current) =>
  resolveEffects(current)?.then((res) =>
    unmountedEffectMap.set(current, res.filter(Boolean) as (() => void)[])
  )
)
