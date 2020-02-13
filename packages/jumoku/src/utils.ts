import { isObject, isFunction } from './is'

export const createProxy = <T extends object>(
  raw: T,
  sideEffect?: (
    target: T,
    prop: string | number | symbol,
    val: any,
    reciver: any
  ) => void
): T => {
  return new Proxy(raw, {
    set: (target, prop, val, reciver) => {
      sideEffect!(target, prop, val, reciver)
      console.log('----proxy state changed-----')
      return Reflect.set(target, prop, val, reciver)
    },
    get: (target, prop, reciver) => {
      const res = Reflect.get(target, prop, reciver)
      return isObject(res) && !isFunction(res)
        ? createProxy(res, sideEffect)
        : res
    }
  })
}
