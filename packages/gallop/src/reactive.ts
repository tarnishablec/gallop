// @ts-nocheck

import {
  shallowEqual,
  isObject,
  MapTypes,
  MapKey,
  SetTypes,
  DeleteItem,
  StrongTypes,
  SetItem,
  forceGet
} from './utils'
import { LockedProxyError } from './error'
import { Recycler } from './dirty'

const rawProxyMap = new WeakMap()
const collections = [Map, Set, WeakMap, WeakSet] as const

export const __raw__ = Symbol('__raw__')

export const createProxy = <T extends object>(
  raw: T,
  {
    onMut,
    onGet,
    lock = false,
    deep = true
  }: {
    onMut?: (
      target: unknown,
      prop: unknown,
      val: unknown,
      receiver?: unknown
    ) => void
    onGet?: (target: unknown, prop: unknown, receiver?: unknown) => void
    lock?: boolean
    deep?: boolean
  } = {}
): T => {
  const getter = (target: unknown) =>
    deep && isObject(target)
      ? forceGet(rawProxyMap, target, () =>
          createProxy(target, { onGet, onMut, lock, deep })
        )
      : target

  if (collections.some((v) => raw instanceof v)) {
    const delegator = {
      get: function <T extends MapTypes>(this: MapTypes, key: MapKey<T>) {
        const r = Reflect.get(this, __raw__)
        onGet?.(r, key, this)
        return getter(r.get(key))
      },
      set: function <T extends MapTypes>(
        this: MapTypes,
        key: MapKey<T>,
        value: unknown
      ) {
        const r = Reflect.get(this, __raw__)
        const res = r.get(key)
        const hasChanged = !shallowEqual(
          isObject(res) ? Reflect.get(res, __raw__) : res,
          value
        )
        if (hasChanged) {
          onMut?.(r, key, value, this)
          Recycler.markDirty(this)
        }
        return r.set(key, value)
      },
      delete: function <T extends MapTypes | SetTypes>(
        this: T,
        item: DeleteItem<T>
      ) {
        const r = Reflect.get(this, __raw__)
        if (r.has(item)) {
          onMut?.(r, item, undefined, this)
          Recycler.markDirty(this)
        }
        return r.delete(item)
      },
      clear: function <T extends StrongTypes>(this: T) {
        const r = Reflect.get(this, __raw__)
        if (r.size) {
          onMut?.(r, undefined, undefined, this)
          Recycler.markDirty(this)
        }
        return r.clear()
      },
      add: function <T extends SetTypes>(this: T, item: SetItem<T>) {
        const r = Reflect.get(this, __raw__)
        if (!r.has(item)) {
          onMut?.(r, undefined, item, this)
          Recycler.markDirty(this)
        }
        return r.add(item)
      }
    }
    return new Proxy(raw, {
      get: (
        target,
        prop:
          | typeof __raw__
          | keyof Map<unknown, unknown>
          | keyof WeakMap<object, unknown>
          | keyof Set<unknown>
          | keyof WeakSet<object>,
        receiver
      ) => {
        if (prop === __raw__) return target
        const value = Reflect.get(target, prop, receiver)
        if (typeof value === 'function')
          return (
            Reflect.get(delegator, prop)?.bind(receiver) ?? value.bind(target)
          )
        return value
      }
    })
  }
  return new Proxy(raw, {
    set: (target, prop, val, receiver) => {
      if (lock && !(prop in target)) throw LockedProxyError(target, prop)
      const hasChanged = !shallowEqual(Reflect.get(target, prop), val)
      const res = Reflect.set(target, prop, val, receiver)
      if (hasChanged) {
        Array.isArray(target) && Recycler.markDirty(receiver)
        onMut?.(target, prop, val, receiver)
      }
      return res
    },
    get: (target, prop, receiver) => {
      if (prop === __raw__) return target
      const res = Reflect.get(target, prop)
      onGet?.(target, prop, receiver)
      return getter(res)
    }
  })
}
