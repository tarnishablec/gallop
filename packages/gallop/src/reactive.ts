import { shallowEqual } from './utils'
import { isProxy } from './is'
import { LockedProxyError } from './error'

export const _isProxy = Symbol('isProxy')
export const _hasChanged = Symbol('hasChanged')

export const createProxy = <T extends object>(
  raw: T,
  setSideEffect?: (
    target: T,
    prop: string | number | symbol,
    val: unknown,
    receiver: unknown
  ) => void,
  getSideEffect?: (
    target: T,
    prop: string | number | symbol,
    receiver: unknown
  ) => void,
  lock: boolean = false
): T =>
  new Proxy(raw, {
    set: (target, prop, val, receiver) => {
      if (lock) {
        if (!(prop in target)) {
          throw LockedProxyError(target)
        }
      }
      let hasChanged = !shallowEqual(Reflect.get(target, prop), val)
      Reflect.set(target, _hasChanged, hasChanged, receiver)
      let res = Reflect.set(target, prop, val, receiver)
      hasChanged && setSideEffect?.(target, prop, val, receiver)
      return res
    },
    get: (target, prop, reciver) => {
      if (prop === _isProxy) {
        return true
      }
      if (prop === _hasChanged) {
        return Reflect.get(target, _hasChanged) ?? false
      }
      getSideEffect?.(target, prop, reciver)
      const res = Reflect.get(target, prop, reciver)
      return res instanceof Object &&
        !(res instanceof Function) &&
        !isProxy(res)
        ? createProxy(res, setSideEffect, getSideEffect, lock)
        : res
    }
  })
