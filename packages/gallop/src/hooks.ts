import { Obj, isObject, forceGet } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'
import { Context } from './context'
import { ReactiveElement } from './component'
import { Recycler } from './dirty'
import { stubTrue } from 'lodash'

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

export function useContext(contexts: Context<Obj>[]) {
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
  forceGet(depCountMap, current, new Map()).set(depCount, depends)
  lastDepEl = current
  depCount++
  return [dirty, diff, depCount - 1]
}

type Effect = () => void | (() => void)
export const effectQueueMap = new WeakMap<ReactiveElement, (Effect | undefined)[]>()
export const unmountedEffectMap = new WeakMap<ReactiveElement, (() => void)[]>()
export function useEffect(effect: Effect, depends?: unknown[]) {
  const current = Looper.resolveCurrent()
  const [dirty, diff, count] = useDepends(depends)
  diff && effectQueueMap.set(current, [])
  dirty && (forceGet(effectQueueMap, current, [])[count] = effect)
}
export function resolveEffects(current: ReactiveElement) {
  const effects = effectQueueMap.get(current)
  return (
    effects &&
    new Promise<(void | (() => void))[]>((resolve) => {
      const resList = unmountedEffectMap.get(current) ?? []
      setTimeout(() => {
        effects.forEach((e, i) => {
          const res = e?.()
          res && (resList[i] = res)
          resolve(resList)
        })
      }, 0)
    })
  )
}

const memoMap = new WeakMap<ReactiveElement, unknown[]>()
export function useMemo<T>(func: () => T, depends?: unknown[]): T {
  const current = Looper.resolveCurrent()
  const [dirty, , count] = useDepends(depends)
  const vals = forceGet(memoMap, current, [])
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
