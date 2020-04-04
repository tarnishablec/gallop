import { resolveCurrentHandle, UpdatableElement } from './component'
import { createProxy, _hasChanged } from './reactive'
import { isProxy } from './is'
import { shallowEqual } from './utils'

export function useState<T extends object>(
  initState: T,
  reactive: boolean = true
): [T] {
  const current = resolveCurrentHandle()
  if (!current.$state) {
    current.$state = [undefined, undefined]
  }
  return (reactive
    ? [
        current.$state[0] ??
          (current.$state[0] = createProxy(initState, () =>
            current.enUpdateQueue()
          ))
      ]
    : [current.$state[1] ?? (current.$state[1] = initState)]) as [T]
}

export type Effect = (
  ...args: any[]
) => void | ((this: UpdatableElement, ...args: any[]) => void)

export function useEffect(effect: Effect, depends?: ReadonlyArray<unknown>) {
  const current = resolveCurrentHandle()

  const count = current.$effectsCount

  if (!depends) {
    if (!current.$updateEffects) {
      current.$updateEffects = []
    }
    current.$updateEffects.push(effect)
  } else if (depends.length === 0) {
    if (!current.$mountedEffects) {
      current.$mountedEffects = []
    }
    current.$mountedEffects.push(effect)
  } else {
    let shouldTrigger = false
    for (let i = 0; i < depends.length; i++) {
      const dep = depends[i]
      if (isProxy(dep)) {
        if (Reflect.get(dep, _hasChanged)) {
          shouldTrigger = true
        }
      } else {
        if (!current.$dependsCache) {
          current.$dependsCache = []
        }
        if (!current.$dependsCache[count]) {
          current.$dependsCache[count] = []
        }

        if (!shallowEqual(dep, current.$dependsCache[count][i])) {
          shouldTrigger = true
        }
        current.$dependsCache[count][i] = dep
      }
    }
    if (shouldTrigger) {
      const updateEffects =
        current.$updateEffects ?? (current.$updateEffects = [])
      updateEffects.push(effect)
    }
  }

  current.$effectsCount++
}

export function resolveEffect(element: UpdatableElement, effect: Effect) {
  setTimeout(() => {
    const res = effect.apply(element)
    res
      ? (
          element.$disconnectedEffects ?? (element.$disconnectedEffects = [])
        ).push(res)
      : null
  }, 0)
}
