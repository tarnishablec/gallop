import { resolveCurrentHandle, ReactiveElement } from './component'
import { createProxy, _hasChanged, resetChangedSet } from './reactive'
import { isProxy } from './is'
import { shallowEqual, Key } from './utils'
import { Context } from './context'
import { Memo } from './memo'

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
        if (Reflect.get(dep, _hasChanged) !== undefined) {
          shouldTrigger = true
        }
      } else {
        current.$effectDepends || (current.$effectDepends = [])
        current.$effectDepends[count] || (current.$effectDepends[count] = [])
        if (!shallowEqual(dep, current.$effectDepends[count][i])) {
          shouldTrigger = true
        }
        current.$effectDepends[count][i] = dep
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

export function useContext(contexts: Context<any>[]) {
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

export function useMemo<T extends () => any>(
  calc: T,
  depends?: unknown[]
): [ReturnType<T>] {
  const current = resolveCurrentHandle()
  const count = current.$memosCount

  if (!current.$memos) {
    current.$memos = new Map()
  }
  let memo = current.$memos.get(count)
  if (!memo) {
    depends && (current.$memoDepends || (current.$memoDepends = []))
    memo = new Memo(calc)
    current.$memos.set(count, memo)
    depends && (current.$memoDepends![count] = depends)
    current.$memosCount++
    return [memo.value]
  } else {
    let shouldRecalc = false
    for (const [obj, key] of memo.watchList) {
      if ((Reflect.get(obj, _hasChanged) as Set<Key>)?.has(key)) {
        shouldRecalc = true
        break
      }
    }
    if (depends) {
      for (let i = 0; i < depends.length; i++) {
        current.$memoDepends![count] || (current.$memoDepends![count] = [])
        if (!shallowEqual(current.$memoDepends![count][i], depends[i])) {
          shouldRecalc = true
        }
        current.$memoDepends![count][i] = depends[i]
      }
    }
    resetChangedSet()
    current.$memosCount++
    return [shouldRecalc ? (memo.value = calc()) : memo.value]
  }
}

export function useStyle(czz: () => string, depends?: unknown[]) {
  const current = resolveCurrentHandle()
  useMemo(() => {
    let el = current.$root.querySelector('style.hook-style')
    if (!el) {
      el = document.createElement('style')
      el.classList.add('hook-style')
      current.$root.append(el)
    }
    el.innerHTML = czz()
  }, depends)
}
