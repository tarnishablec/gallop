import { ReactiveElement } from './component'
import { ReacMap, resetDirtyCollectionSet } from './reactive'
import {
  resolveEffects,
  effectQueueMap,
  unmountEffectMap,
  resetLastDepEl
} from './hooks'

const createCallbackMap = <CB extends (...args: any[]) => unknown>() =>
  new ReacMap<string, CB, { before: string } | { after: string }>({
    onSet: (k, v, s, p) => {
      const mapArr = Array.from(s.$map)
      if (p) {
        const index =
          'before' in p
            ? mapArr.findIndex((a) => a[0] === p.before)
            : mapArr.findIndex((a) => a[0] === p.after) + 1
        mapArr.splice(~index ? index : Infinity, 0, [k, v])
        s.$map = new Map(mapArr)
      } else {
        s.$map.set(k, v)
      }
      return s
    }
  })

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

  static loopEachCallbacks = createCallbackMap<
    (current: ReactiveElement) => unknown
  >()
  static loopEndCallbacks = createCallbackMap<() => void>()

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
