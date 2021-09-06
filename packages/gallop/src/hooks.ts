import { Obj, forceGet } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'
import type { Context } from './context'
import { ReactiveElement, observeDisconnect } from './component'
import { Recycler } from './dirty'

export function useState<T extends Obj>(raw: T) {
  const current = Looper.resolveCurrentElement<Obj, T>()
  return [
    current.$state ??
      (current.$state = createProxy(raw, {
        onMut: () => current.requestUpdate()
      }))
  ] as const
}

let lastHookEl: ReactiveElement | undefined
export const resetLastHookEl = () => (lastHookEl = undefined)
export function useLastHookEl(el = Looper.resolveCurrentElement()) {
  return (lastHookEl = el)
}

Looper.setLoopEndCallBack('resetLastHookEl', resetLastHookEl, 1)

let hookCount: number
export function useHookCount() {
  const current = Looper.resolveCurrentElement()
  hookCount = current !== lastHookEl ? 0 : hookCount + 1
  useLastHookEl()
  return hookCount
}

const extendStateMap = new Map<ReactiveElement, Map<number, Obj>>()
export function useExtendState<T extends Obj>(raw: T) {
  const current = Looper.resolveCurrentElement()
  const count = useHookCount()
  // const map = forceGet(extendStateMap, current, () => new Map<number, Obj>())
  return [
    forceGet(
      forceGet(extendStateMap, current, () => new Map<number, Obj>()),
      count,
      () => createProxy(raw, { onMut: () => current.requestUpdate() })
    ) as T
  ] as const
}

export function useContext<T extends Obj>(context: Context<T>) {
  const current = Looper.resolveCurrentElement()
  context.watch(current)
  return [context.data] as const
}

const depCountMap = new WeakMap<ReactiveElement, Map<number, unknown[]>>()
export function useDepends(depends?: unknown[]): [boolean, number] {
  const current = Looper.resolveCurrentElement()
  const count = useHookCount()
  if (!depends) {
    return [true, count]
  }
  const oldDeps = depCountMap.get(current)?.get(count)
  const dirty = Recycler.compareDepends(oldDeps, depends)
  forceGet(depCountMap, current, () => new Map<number, unknown[]>()).set(
    count,
    depends
  )
  return [dirty, count]
}

type DisconnectEffect = () => unknown
type Effect = () => void | DisconnectEffect | Promise<void | DisconnectEffect>
const effectQueueMap = new WeakMap<ReactiveElement, (Effect | undefined)[]>()
const disconnectEffectMap = new WeakMap<ReactiveElement, DisconnectEffect[]>()
export function useEffect(effect: Effect, depends?: unknown[]) {
  const current = Looper.resolveCurrentElement()
  const [dirty, count] = useDepends(depends)
  forceGet(effectQueueMap, current, () => [])[count] = dirty
    ? effect
    : undefined
}
export function resolveEffects(el: ReactiveElement) {
  const effects = effectQueueMap.get(el)
  return (
    effects &&
    setTimeout(() => {
      const { length } = effects
      if (length === 0) return
      effects.forEach(async (e, i) => {
        const res = await e?.()
        if (res) {
          let resList: DisconnectEffect[]
          const temp = disconnectEffectMap.get(el)
          if (temp) resList = temp
          else {
            resList = []
            disconnectEffectMap.set(el, resList)
            effects.filter(Boolean).length &&
              observeDisconnect(el, () => {
                resList.forEach((fn) => fn())
                disconnectEffectMap.delete(el)
              })
          }
          resList[i] = res
        }
      })
    }, 0)
  )
}

Looper.setLoopEachCallBack('resolveEffects', resolveEffects)

const memoMap = new WeakMap<ReactiveElement, unknown[]>()
export function useMemo<T>(func: () => T, depends?: unknown[]): T {
  const current = Looper.resolveCurrentElement()
  const [dirty, count] = useDepends(depends)
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
  const current = Looper.resolveCurrentElement()
  const [dirty, count] = useDepends(depends)
  if (dirty) {
    let styleEl = current.$root.querySelector<HTMLStyleElement>(
      `style.hook-style-${count}`
    )
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.classList.add(`hook-style-${count}`)
      current.$root.append(styleEl)
    }
    styleEl.innerHTML = css()
  }
}

type MutableRefObject<T> = {
  current: T
}

type RefObject<T> = {
  readonly current: T
}

const refMap = new WeakMap<ReactiveElement, { current: unknown }[]>()
export function useRef<T = undefined>(): MutableRefObject<T | undefined>
export function useRef<T>(initalValue: T | null): RefObject<T>
export function useRef<T>(initalValue: T): MutableRefObject<T>
export function useRef<T>(initalValue?: T): MutableRefObject<T> {
  const current = Looper.resolveCurrentElement()
  const count = useHookCount()
  const vals = forceGet(refMap, current, () => [])
  return (vals[count] ?? (vals[count] = { current: initalValue })) as {
    current: T
  }
}

export function useDisconnect() {}
