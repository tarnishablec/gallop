import { isObject, isFunction } from './is'

// const collectionTypes = new Set<Function>([Set, Map, WeakMap, WeakSet])

export const createProxy = <T extends object>(
  raw: T,
  setSideEffect?: (
    target: T,
    prop: string | number | symbol,
    val: any,
    receiver: any
  ) => void,
  getSideEffect?: (
    target: T,
    prop: string | number | symbol,
    receiver: any
  ) => void
): T => {
  return new Proxy(raw, {
    set: (target, prop, val, receiver) => {
      setSideEffect?.(target, prop, val, receiver)
      console.log(`----proxy state changed-----${String(prop)}`)
      return Reflect.set(target, prop, val, receiver)
    },
    get: (target, prop, reciver) => {
      getSideEffect?.(target, prop, reciver)
      console.log(`----proxy state getted-----${String(prop)}`)
      const res = Reflect.get(target, prop, reciver)
      return isObject(res) && !isFunction(res)
        ? createProxy(res, setSideEffect, getSideEffect)
        : res
    }
  })
}
