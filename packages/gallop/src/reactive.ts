import { shallowEqual, Key } from './utils'
import { isProxy } from './is'
import { LockedProxyError } from './error'
import { resolveCurrentMemo } from './memo'

export const _isProxy = Symbol('isProxy')
export const _hasChanged = Symbol('hasChanged')

const changedSet = new Set<object>()
export const resetChangedSet = () =>
  changedSet.forEach((c) => Reflect.set(c, _hasChanged, undefined))

const rawProxyMap = new WeakMap<object, object>()

export const createProxy = <T extends object>(
  raw: T,
  setSideEffect?: (
    target: T,
    prop: Key,
    val: unknown,
    receiver: unknown
  ) => void,
  getSideEffect?: (target: T, prop: Key, receiver: unknown) => void,
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
      if (hasChanged) {
        const hc = Reflect.get(target, _hasChanged) ?? new Set()
        Reflect.set(target, _hasChanged, hc.add(prop), receiver)
        changedSet.add(target)
      }
      let res = Reflect.set(target, prop, val, receiver)
      hasChanged && setSideEffect?.(target, prop, val, receiver)
      return res
    },
    get: (target, prop, reciver) => {
      if (prop === _isProxy) {
        return true
      }
      if (prop === _hasChanged) {
        return Reflect.get(target, _hasChanged)
      }
      const memo = resolveCurrentMemo()
      memo && memo.watch(target, prop)

      getSideEffect?.(target, prop, reciver)
      const res = Reflect.get(target, prop, reciver)
      if (
        res instanceof Object &&
        !(res instanceof Function) &&
        !isProxy(res)
      ) {
        if (!rawProxyMap.has(res)) {
          const temp = createProxy(res, setSideEffect, getSideEffect, lock)
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
