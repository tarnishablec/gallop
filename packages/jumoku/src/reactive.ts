import { isObject, isFunction, isProxy } from './is'

// const collectionTypes = new Set<Function>([Set, Map, WeakMap, WeakSet])

export const _isProxy = Symbol('isProxy')

export type Proxyed<T> = T | { [_isProxy]: true }

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
  lock: boolean = true
): Proxyed<T> => {
  let res = new Proxy(raw, {
    set: (target, prop, val, receiver) => {
      if (lock) {
        if (!(prop in target)) {
          throw new Error('can not set to locked object')
        }
      }
      setSideEffect?.(target, prop, val, receiver)
      console.log(`----proxy state changed-----${String(prop)}`)
      return Reflect.set(target, prop, val, receiver)
    },
    get: (target, prop, reciver) => {
      getSideEffect?.(target, prop, reciver)
      // console.log(`----proxy state getted-----${String(prop)}`)
      const res = Reflect.get(target, prop, reciver)
      return isObject(res) && !isFunction(res) && !isProxy(res)
        ? createProxy(res, setSideEffect, getSideEffect)
        : res
    }
  })
  return { [_isProxy]: true, ...res }
}

// type A<T> = T | { a: number }

// function test<T, K extends keyof T>(t: A<T>, k: K) {
//   console.log(t[k])
// }
