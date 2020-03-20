import { createProxy, _hasChanged } from './reactive'
import { StateCanNotUseError } from './error'
import { resolveCurrentHandle, UpdatableElement } from './component'
import { isUpdatableElement, isProxy, isPrimitive } from './is'

export const useState = <T extends object>(initValue: T): [T] => {
  let current = resolveCurrentHandle()
  if (isUpdatableElement(current)) {
    if (!current.$state) {
      return [
        (current.$state = createProxy(initValue, () =>
          current?.enupdateQueue()
        ))
      ]
    } else {
      return [current.$state] as [T]
    }
  }
  throw StateCanNotUseError
}

export function useRef(element?: Element) {
  let current = resolveCurrentHandle()
  return [element, current]
}

export type Effect = () => (() => void) | void

export type EffectRegistration = {
  effect: Effect
  depends?: unknown[]
}

export const useEffect = (effect: Effect, depends?: unknown[]) => {
  const current = resolveCurrentHandle()
  // console.log(current)
  if (current) {
    if (!current.effectsRegs) {
      current.effectsRegs = []
    }
    if (!current.onceEffectIndexs) {
      current.onceEffectIndexs = []
    }
    let index = current.effectsRegs.push({ effect, depends }) - 1
    let { effect: eff, depends: deps } = current.effectsRegs[index]

    if (!deps) {
      current.mountCallbacks.push(eff)
      current.updateCallbacks.push(eff)
    } else if (deps.length === 0) {
      current.mountCallbacks.push(eff)
    } else {
      if (!current.effectHookOldVals) {
        current.effectHookOldVals = []
      }
      let triggered = false
      for (let j = 0; j < deps.length; j++) {
        if (isPrimitive(deps[j])) {
          if (!current.effectHookOldVals![index]) {
            current.effectHookOldVals[index] = []
          }
          if (current.effectHookOldVals[index][j] !== deps[j]) {
            if (!triggered) {
              current.mountCallbacks.push(eff)
              current.updateCallbacks.push(eff)
              triggered = true
            }
            current.effectHookOldVals[index][j] = deps[j]
          }
        } else if (isProxy(deps[j] as object)) {
          if (Reflect.get(deps[j] as object, _hasChanged)) {
            if (!triggered) {
              current.mountCallbacks.push(eff)
              current.updateCallbacks.push(eff)
              triggered = true
            }
          }
        }
      }
    }
  }
}

export const resolveEffect = (effect: Effect, current: UpdatableElement) => {
  let res = effect()
  res ? current.unmountCallbacks.push(res) : null
}
