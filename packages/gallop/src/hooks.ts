import { Obj } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'
import { Context } from './context'
import { ReactiveElement } from './component'

export function useState<T extends Obj>(raw: T): [T] {
  const current = Looper.resolveCurrent()
  return [
    current.$state
      ? (current.$state as T)
      : (current.$state = createProxy(raw, {
          onSet: () => current.requestUpdate()
        }))
  ]
}

export function useContext(contexts: Context<Obj>[]) {
  const current = Looper.resolveCurrent()
  contexts.forEach((ctx) => ctx.watch(current))
}

export let hookElLast: ReactiveElement | undefined
export const resetLastHookEl = () => (hookElLast = undefined)
// Looper.loopFinishCallbacks.set('resetLastHookEl', resetLastHookEl)
let depCount: number
const depCountMap = new WeakMap<ReactiveElement, Map<number, unknown[]>>()
export function useDepends(depends?: unknown[]): [boolean, boolean] {
  const current = Looper.resolveCurrent()
  let diff: boolean = false
  if (current !== hookElLast) {
    depCount = 0
    diff = true
  }
  if (!depends) {
    return [true, diff]
  }
  const oldVals = depCountMap.get(current)?.get(depCount)
  let dirty = false
  if (!oldVals) {
    dirty = true
  } else {
    depends.forEach((dep, i) => {
      Object.is(dep, oldVals[i]) || (dirty = true)
    })
  }
  !(
    depCountMap.get(current) ??
    depCountMap.set(current, new Map()).get(current)!
  ).set(depCount, depends)
  hookElLast = current
  depCount++
  return [dirty, diff]
}

type Effect = () => void | (() => void)
export const effectQueueMap = new WeakMap<ReactiveElement, Effect[]>()
export const unmountEffectMap = new WeakMap<ReactiveElement, (() => void)[]>()
export function useEffect(effect: Effect, depends?: unknown[]) {
  const current = Looper.resolveCurrent()
  const [dirty, diff] = useDepends(depends)
  diff && effectQueueMap.set(current, [])
  dirty &&
    (effectQueueMap.get(current) ??
      effectQueueMap.set(current, []).get(current))!.push(effect)
}
export const resolveEffects = (effects?: Effect[]) =>
  effects &&
  Promise.resolve().then(() => {
    const res: (void | (() => void))[] = []
    effects.forEach((e) => res.push(e()))
    return res.filter(Boolean) as (() => void)[]
  })
//
