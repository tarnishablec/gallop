import { createProxy, _hasChanged } from './reactive'
import { StateCanNotUseError } from './error'
import { resolveCurrentHandle } from './component'
import { isUpdatableElement, isProxy, isPrimitive } from './is'
import { Clip } from './clip'
import { twoArrayShallowEqual } from './utils'

export const useState = <T extends object>(initValue: T): [T] => {
  let current = resolveCurrentHandle()
  if (isUpdatableElement(current)) {
    if (!current.$state) {
      return [
        (current.$state = createProxy(initValue, () => current.enupdateQueue()))
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
  detect?: unknown[]
  oldVal?: unknown[]
}

export const resolveEffect = (clip: Clip) => {
  const regs = clip.effectsRegs
  let desEffs: (() => void)[] = []
  regs.forEach((reg, index) => {
    if (!reg.detect) {
      let res = reg.effect()
      res ? desEffs.push(res) : null
    } else if (reg.detect.length === 0) {
      clip.effectsRegs.splice(index, 1)
      let res = reg.effect()
      res ? desEffs.push(res) : null
    } else {
      let deps = reg.detect
      if (!reg.oldVal) {
        clip.effectsRegs[index].oldVal = new Array(deps.length).fill(undefined)
      }
      deps.forEach((d, j) => {
        let hasEffected = false
        if (isPrimitive(d)) {
          // console.log( clip.effectsRegs[index].oldVal![j])
          // if (d !== reg.oldVal?.[j]) {
          //   let res = hasEffected ? null : reg.effect()
          //   res ? desEffs.push(res) : null
          //  clip.effectsRegs[index].oldVal![j] = d
          // }
        } else if (isProxy(d as object)) {
          if (Reflect.get(d as object, _hasChanged)) {
            let res = hasEffected ? null : reg.effect()
            res ? desEffs.push(res) : null
          }
        }
      })
    }
  })
  return desEffs.filter(a => !!a)
}
