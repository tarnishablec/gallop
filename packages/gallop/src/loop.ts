import type { ReactiveElement } from './component'
import { resolveEffects, resetLastHookEl } from './hooks'
import { Recycler } from './dirty'
import { Obj } from './utils'

export type LoopCallbackBase = {
  name: string
  priority: number
}

export type LoopEachCallback = LoopCallbackBase & {
  cb: (current: ReactiveElement) => unknown
}

export type LoopEndCallback = LoopCallbackBase & { cb: () => void }

export class Looper {
  private constructor() {}

  protected static current?: ReactiveElement
  static resolveCurrent = <
    Props extends Obj = Obj,
    State extends Obj | undefined = undefined
  >() => Looper.current as ReactiveElement<Props, State>
  static setCurrent = (el: ReactiveElement | undefined) => (Looper.current = el)
  static enUpdateQueue = (el: ReactiveElement) =>
    Looper.updateQueue.add(el) && Looper.flush()

  static loopEachCallbacks: LoopEachCallback[] = []
  static loopEndCallbacks: LoopEndCallback[] = []

  protected static updateQueue = new Set<ReactiveElement>()
  protected static dirty = false
  static flush() {
    if (Looper.dirty) return
    Looper.dirty = true
    requestAnimationFrame(() => {
      Looper.updateQueue.forEach((instance) => {
        Looper.setCurrent(instance)
        instance.dispatchUpdate()
        Looper.loopEachCallbacks.forEach((entry) => entry.cb(instance))
      })
      Looper.setCurrent(undefined)
      Looper.dirty = false
      Looper.updateQueue.clear()
      Looper.loopEndCallbacks.forEach((entry) => entry.cb())
    })
  }

  static setLoopEachCallBack(
    name: string,
    cb: (current: ReactiveElement) => unknown,
    priority = 0
  ) {
    this.setLoopCallback(Looper.loopEachCallbacks, name, cb, priority)
  }

  static setLoopEndCallBack(name: string, cb: () => void, priority = 0) {
    this.setLoopCallback(Looper.loopEndCallbacks, name, cb, priority)
  }

  private static setLoopCallback(
    callbackArray: LoopEachCallback[] | LoopEndCallback[],
    name: string,
    cb: (current: ReactiveElement) => unknown,
    priority = 0
  ) {
    for (let i = 0; i <= callbackArray.length; i++) {
      const entry = callbackArray[i]
      if (!entry || entry.priority < priority || i === callbackArray.length) {
        callbackArray.splice(i - 1, 0, { name, cb, priority })
        return
      }
    }
  }
}

// Loop end
Looper.setLoopEndCallBack('resetLastHookEl', resetLastHookEl, 1)
Looper.setLoopEndCallBack(
  'resetDirtyCollectionSet',
  Recycler.resetDirtyCollectionSet,
  0
)

// Loop each
Looper.setLoopEachCallBack('resolveEffects', resolveEffects)
