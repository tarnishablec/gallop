import { Obj, shallowEqual, Key } from './utils'
import { LockedProxyError } from './error'

const rawProxyMap = new WeakMap()

export let dirtyMap = new WeakMap()
export const resetDirtyMap = () => (dirtyMap = new WeakMap())

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
): T =>
  new Proxy(raw, {
    set: (target, prop, val, receiver) => {
      if (lock) {
        if (!(prop in target)) {
          throw LockedProxyError(target, prop)
        }
      }
      const hasChanged = !shallowEqual(Reflect.get(target, prop), val)
      const res = Reflect.set(target, prop, val, receiver)
      if (hasChanged) {
        dirtyMap.set(target, (dirtyMap.get(target) ?? new Set()).add(prop))
        onSet?.(target, prop, val, receiver)
      }
      return res
    },
    get: (target, prop, receiver) => {
      const res = Reflect.get(target, prop)
      onGet?.(target, prop, receiver)
      if (deep && res instanceof Object && !(res instanceof Function)) {
        if (rawProxyMap.has(res)) {
          return rawProxyMap.get(res)
        } else {
          const p = createProxy(res, { onSet, onGet, lock, deep })
          rawProxyMap.set(res, p)
          return p
        }
      }
      return res
    }
  })
