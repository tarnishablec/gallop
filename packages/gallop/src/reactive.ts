import { Obj, shallowEqual, Primitive } from './utils'
import { LockedProxyError } from './error'

type Key = Exclude<Primitive, null | boolean | bigint | undefined>

const rawProxyMap = new WeakMap()

export let dirtyCollectionSet = new WeakSet()
export const resetDirtyCollectionSet = () =>
  (dirtyCollectionSet = new WeakSet())

export const createProxy = <T extends Obj>(
  raw: T,
  {
    onSet,
    onGet,
    lock = false,
    deep = true
  }: {
    onSet?: (target: T, prop: Key, val: unknown, receiver: unknown) => void
    onGet?: (target: T, prop: Key, receiver: unknown) => void
    lock?: boolean
    deep?: boolean
  } = {}
): T => {
  return new Proxy(raw, {
    set: (target, prop, val, receiver) => {
      if (lock && !(prop in target)) throw LockedProxyError(target, prop)
      const hasChanged = !shallowEqual(Reflect.get(target, prop), val)
      const res = Reflect.set(target, prop, val, receiver)
      if (hasChanged) {
        Array.isArray(target) && dirtyCollectionSet.add(target)
        onSet?.(target, prop, val, receiver)
      }
      return res
    },
    get: (target, prop, receiver) => {
      const res = Reflect.get(target, prop)
      onGet?.(target, prop, receiver)
      if (deep && res instanceof Object && !(res instanceof Function)) {
        if (rawProxyMap.has(res)) return rawProxyMap.get(res)
        const p = createProxy(res, { onSet, onGet, lock, deep })
        rawProxyMap.set(res, p)
        return p
      }
      return res
    }
  })
}
