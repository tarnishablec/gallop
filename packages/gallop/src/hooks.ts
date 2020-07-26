import { Obj, isObject, forceGet } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'
import { Context } from './context'
import { ReactiveElement, observeDisconnect } from './component'
import { Recycler } from './dirty'

export function useState<T extends Obj>(raw: T): [T] {
  const current = Looper.resolveCurrent()
  return [
    current.$state
      ? (current.$state as T)
      : (current.$state = createProxy(raw, {
          onMut: () => current.requestUpdate()
        }))
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useContext(contexts: Context<any>[]) {
  const current = Looper.resolveCurrent()
  contexts.forEach((ctx) => ctx.watch(current))
}

export let lastDepEl: ReactiveElement | undefined
export const resetLastDepEl = () => (lastDepEl = undefined)
let depCount: number
const depCountMap = new WeakMap<ReactiveElement, Map<number, unknown[]>>()
export function useDepends(depends?: unknown[]): [boolean, boolean, number] {
  const current = Looper.resolveCurrent()
  let diff: boolean = false
  if (current !== lastDepEl) {
    depCount = 0
    diff = true
  }
  if (!depends) {
    depCount++
    return [true, diff, depCount - 1]
  }
  const oldVals = depCountMap.get(current)?.get(depCount)
  let dirty = false
  if (!oldVals) {
    dirty = true
  } else {
    for (let i = 0; i < depends.length; i++) {
      const dep = depends[i]
      if (
        (isObject(dep) &&
          (!Object.is(dep, oldVals[i]) || Recycler.checkDirty(dep))) ||
        !Object.is(dep, oldVals[i])
      ) {
        dirty = true
        break
      }
    }
  }
  forceGet(depCountMap, current, () => new Map()).set(depCount, depends)
  lastDepEl = current
  depCount++
  return [dirty, diff, depCount - 1]
}

type Effect = () => void | (() => void)
type DisconnectEffect = () => unknown
const effectQueueMap = new WeakMap<ReactiveElement, (Effect | undefined)[]>()
const disconnectEffectMap = new WeakMap<ReactiveElement, DisconnectEffect[]>()
export function useEffect(effect: Effect, depends?: unknown[]) {
  const current = Looper.resolveCurrent()
  const [dirty, diff, count] = useDepends(depends)
  diff && effectQueueMap.set(current, [])
  dirty && (forceGet(effectQueueMap, current, () => [])[count] = effect)
}
export function resolveEffects(el: ReactiveElement) {
  const effects = effectQueueMap.get(el)
  return (
    effects &&
    new Promise<DisconnectEffect[]>((resolve) => {
      let resList: DisconnectEffect[]
      const temp = disconnectEffectMap.get(el)
      if (temp) resList = temp
      else {
        resList = []
        disconnectEffectMap.set(el, resList)
        resList.filter(Boolean).length &&
          observeDisconnect(el, () => {
            resList.forEach((fn) => fn())
            disconnectEffectMap.delete(el)
          })
      }
      setTimeout(() => {
        effects.forEach((e, i) => {
          const res = e?.()
          res && (resList[i] = res)
        })
        resolve(resList)
      }, 0)
    })
  )
}

const memoMap = new WeakMap<ReactiveElement, unknown[]>()
export function useMemo<T>(func: () => T, depends?: unknown[]): T {
  const current = Looper.resolveCurrent()
  const [dirty, , count] = useDepends(depends)
  const vals = forceGet(memoMap, current, () => [])
  if (dirty) {
    const result = func()
    vals[count] = result
    return result
  } else {
    return vals[count] as T
  }
}

export function useStyle(css: () => string, depends: unknown[]) {
  const current = Looper.resolveCurrent()
  const [dirty] = useDepends(depends)
  if (dirty) {
    let styleEl = current.$root.querySelector('.hook-style')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.classList.add('hook-style')
      current.$root.append(styleEl)
    }
    styleEl.innerHTML = css()
  }
}

const cacheMap = new WeakMap<ReactiveElement, Obj>()
export function useCache<T extends Obj>(raw: T): [T] {
  return [forceGet(cacheMap, Looper.resolveCurrent(), () => raw) as T]
}
