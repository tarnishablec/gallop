import { resolveCurrentHandle, ReactiveElement } from './component'
import { createProxy, _hasChanged } from './reactive'
import { isProxy } from './is'
import { shallowEqual } from './utils'
import { Context } from './context'

export function useState<T extends object>(initState: T): [T] {
  const current = resolveCurrentHandle()
  return (
    (current.$state as [T]) ??
    (current.$state = [createProxy(initState, () => current.enUpdateQueue())])
  )
}

export type Effect = (
  ...args: any[]
) => void | ((this: ReactiveElement, ...args: any[]) => void)

export function useEffect(effect: Effect, depends?: ReadonlyArray<unknown>) {
  const current = resolveCurrentHandle()

  const count = current.$effectsCount

  if (!depends) {
    if (!current.$updateEffects) {
      current.$updateEffects = []
    }
    current.$updateEffects.push({ e: effect, index: count })
  } else if (depends.length === 0) {
    if (!current.$mountedEffects) {
      current.$mountedEffects = []
    }
    current.$mountedEffects.push({ e: effect, index: count })
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
      updateEffects.push({ e: effect, index: count })
    }
  }

  current.$effectsCount++
}

export function resolveEffects(
  element: ReactiveElement,
  effects?: { e: Effect; index: number }[]
) {
  setTimeout(() => {
    effects?.forEach(({ e, index }) => {
      const res = e.apply(element)
      res
        ? ((element.$disconnectedEffects ??
            (element.$disconnectedEffects = []))[index] = res)
        : null
    })
  }, 0)
}

export function useContext(contexts: Context<object>[]) {
  const current = resolveCurrentHandle()
  if (!current.$contexts) {
    const elementContexts = (current.$contexts = new Set())
    contexts.forEach((context) => {
      context.watch(current)
      elementContexts.add(context)
    })
  }
}

export function useCache<T extends Object>(initVal: T) {
  const current = resolveCurrentHandle()
  return (current.$cache as [T]) ?? (current.$cache = [initVal])
}
