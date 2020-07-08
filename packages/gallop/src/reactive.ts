import { shallowEqual, isObject } from './utils'
import { LockedProxyError } from './error'
import { Recycler } from './dirty'

const rawProxyMap = new WeakMap()

type MapTypes = Map<unknown, unknown> | WeakMap<object, unknown>
type MapKey<T extends MapTypes> = T extends WeakMap<object, unknown>
  ? object
  : unknown

type SetTypes = Set<unknown> | WeakSet<object>
type SetItem<T extends SetTypes> = T extends WeakSet<object> ? object : unknown

type StrongTypes = Map<unknown, unknown> | Set<unknown>
type WeakTypes = WeakMap<object, unknown> | WeakSet<object>

type DeleteItem<T extends MapTypes | SetTypes> = T extends WeakTypes
  ? object
  : unknown

const __raw__ = '__raw__'

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
  function getter(target: unknown) {
    if (deep && isObject(target)) {
      if (rawProxyMap.has(target)) return rawProxyMap.get(target)
      const p = createProxy(target, { onGet, onMut, lock, deep })
      rawProxyMap.set(target, p)
      return p
    }
    return target
  }

  if ([Map, Set, WeakMap, WeakSet].some((v) => raw instanceof v)) {
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
      get: (target, prop, receiver) => {
        if (prop === __raw__) return target
        const value = Reflect.get(target, prop, receiver)
        if (typeof value === 'function')
          return Reflect.get(delegator, prop).bind(receiver)
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
      const res = Reflect.get(target, prop)
      if (prop === __raw__) return target
      onGet?.(target, prop, receiver)
      return getter(res)
    }
  })
}
