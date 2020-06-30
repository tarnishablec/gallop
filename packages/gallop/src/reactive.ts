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
  if (raw instanceof Map) {
    const result = new ReacMap({
      raw,
      onSet: (key, value, self) => {
        onSet?.(raw, key, value, self)
        dirtyCollectionSet.add(result)
        return self
      }
    })
    return (result as unknown) as T
  }

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
}

export class ReacMap<K, V, S = undefined, C = undefined, D = undefined>
  implements Map<K, V> {
  $map: Map<K, V> = new Map()

  constructor(
    public options?: {
      raw?: Map<K, V>
      onSet?: (
        key: K,
        value: V,
        self: ReacMap<K, V, S, C, D>,
        payload?: S
      ) => ReacMap<K, V, S, C, D>
      onClear?: (self: ReacMap<K, V, S, C, D>, payload?: S) => void
      onDelete?: (key: K, self: ReacMap<K, V, S, C, D>, payload?: S) => boolean
    }
  ) {
    options?.raw && (this.$map = options.raw)
  }
  forEach = this.$map.forEach.bind(this.$map)
  get = this.$map.get.bind(this.$map)
  has = this.$map.has.bind(this.$map)
  entries = this.$map.entries.bind(this.$map)
  keys = this.$map.keys.bind(this.$map)
  values = this.$map.values.bind(this.$map)
  size = this.$map.size;
  [Symbol.iterator] = this.$map[Symbol.iterator];
  [Symbol.toStringTag] = this.$map[Symbol.toStringTag]

  set(key: K, value: V, payload?: S) {
    if (this.options?.onSet) {
      return this.options.onSet(key, value, this, payload) as this
    } else {
      this.$map.set(key, value)
      return this
    }
  }
  clear(payload?: S) {
    this.options?.onClear?.(this, payload)
    return this.$map.clear()
  }
  delete = this.$map.delete.bind(this.$map)
}
