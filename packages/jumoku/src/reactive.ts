import { isObject, isFunction, isProxy } from './is'
import { LockedProxyError } from './error'

export const _isProxy = Symbol('isProxy')

export const createProxy = <T extends object>(
  raw: T,
  setSideEffect?: (
    target: T,
    prop: string | number | symbol,
    val: unknown,
    receiver: unknown
  ) => void,
  shouldTriggerSetSideEffect: boolean = true,
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
          throw LockedProxyError
        }
      }
      // console.log(`----proxy state changed-----${String(prop)}`)
      let res = Reflect.set(target, prop, val, receiver)
      if (shouldTriggerSetSideEffect) {
        setSideEffect?.(target, prop, val, receiver)
      }
      return res
    },
    get: (target, prop, reciver) => {
      if (prop === _isProxy) {
        return true
      }
      getSideEffect?.(target, prop, reciver)
      // console.log(`----proxy state getted-----${String(prop)}`)
      const res = Reflect.get(target, prop, reciver)
      return isObject(res) && !isFunction(res) && !isProxy(res)
        ? createProxy(
            res,
            setSideEffect,
            shouldTriggerSetSideEffect,
            getSideEffect,
            lock
          )
        : res
    }
  })

// type A<T> = T | { a: number }

// function test<T, K extends keyof T>(t: A<T>, k: K) {
//   console.log(t[k])
// }
