import { Obj } from './utils'
import { Looper } from './loop'
import { createProxy, dirtyMap } from './reactive'
import { Context } from './context'
import { ReactiveElement } from './component'

export let hookElLast: ReactiveElement | undefined
export const resetLastHookEl = () => (hookElLast = undefined)

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

let depCount: number
const depCountMap = new WeakMap<ReactiveElement, Map<number, unknown[]>>()
export function useDepends(depends: unknown[]) {
  const current = Looper.resolveCurrent()
  if (current !== hookElLast) depCount = 0
  const oldVals = depCountMap.get(current)?.get(depCount)
  let dirty = false
  if (!oldVals) {
    dirty = true
  } else {
    depends.forEach((dep, i) => {
      if (dep instanceof Object) {
        if (!Object.is(dep, oldVals[i]) || dirtyMap.has(dep)) {
          dirty = true
        }
      } else {
        if (!Object.is(dep, oldVals[i])) {
          dirty = true
        }
      }
    })
  }
  !(
    depCountMap.get(current) ??
    depCountMap.set(current, new Map()).get(current)!
  ).set(depCount, depends)
  hookElLast = current
  depCount++
  return dirty
}

type Effect = () => void | (() => void)
export const effectQueueMap = new WeakMap<ReactiveElement, Effect[]>()
export function useEffect(effect: Effect, depends?: unknown[]) {
  const current = Looper.resolveCurrent()
  current !== hookElLast && effectQueueMap.set(current, [])
  const dirty = depends ? useDepends(depends) : true
  dirty &&
    (effectQueueMap.get(current) ??
      effectQueueMap.set(current, []).get(current))!.push(effect)
}
export const resolveEffects = (effects?: Effect[]) => {
  effects &&
    Promise.resolve().then(() => {
      effects.forEach((e) => e())
    })
}
