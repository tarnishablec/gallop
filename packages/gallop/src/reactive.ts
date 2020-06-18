import { shallowEqual, Key } from './utils'
import { isProxy } from './is'
import { LockedProxyError } from './error'
import { Memo } from './memo'

export const _isProxy = Symbol('isProxy')
// export const _dirty = Symbol('dirty')

export const dirtyMap = new Map<object, Set<Key>>()
export const resetDirtyMap = () => dirtyMap.clear()

const rawProxyMap = new WeakMap<object, object>()

export const createProxy = <T extends object>(
  raw: T,
  {
    onSet,
    onGet,
    lock = false,
    deep = true
  }: {
    onSet?: (target: T, prop: Key, val: unknown, receiver: unknown) => void
    onGet?: (target: T, prop: Key, receiver: unknown) => void
    deep?: boolean
    lock?: boolean
  } = {}
): T =>
  new Proxy(raw, {
    // eslint-disable-next-line max-params
    set: (target, prop, val, receiver) => {
      if (lock) {
        if (!(prop in target)) {
          throw LockedProxyError(target)
        }
      }
      const hasChanged = !shallowEqual(Reflect.get(target, prop), val)
      const res = Reflect.set(target, prop, val, receiver)
      if (hasChanged) {
        dirtyMap.set(target, (dirtyMap.get(target) ?? new Set()).add(prop))
      }
      // debugger
      hasChanged && onSet?.(target, prop, val, receiver)
      return res
    },
    get: (target, prop, reciver) => {
      if (prop === _isProxy) {
        return true
      }
      const memo = Memo.resolveCurrentMemo()
      memo && memo.watch(target, prop)

      onGet?.(target, prop, reciver)
      const res = Reflect.get(target, prop, reciver)
      if (
        res instanceof Object &&
        deep &&
        !(res instanceof Function) &&
        !isProxy(res)
      ) {
        if (!rawProxyMap.has(res)) {
          const temp = createProxy(res, { onSet, onGet, lock })
          rawProxyMap.set(res, temp)
          return temp
        } else {
          return rawProxyMap.get(res)
        }
      } else {
        return res
      }
    }
  })
