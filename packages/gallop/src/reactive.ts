import { Obj, shallowEqual, Primitive } from './utils'
import { LockedProxyError } from './error'

const rawProxyMap = new WeakMap()

type Key = Exclude<Primitive, null | boolean | bigint | undefined>

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
      if (lock && !(prop in target)) throw LockedProxyError(target, prop)
      const hasChanged = !shallowEqual(Reflect.get(target, prop), val)
      const res = Reflect.set(target, prop, val, receiver)
      if (hasChanged) onSet?.(target, prop, val, receiver)
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

export class ReacMap<K, V> implements Map<K, V> {
  $map = new Map<K, V>()
  forEach = this.$map.forEach.bind(this.$map)
  get = this.$map.get.bind(this.$map)
  has = this.$map.has.bind(this.$map)
  entries = this.$map.entries.bind(this.$map)
  keys = this.$map.keys.bind(this.$map)
  values = this.$map.values.bind(this.$map)
  size = this.$map.size;
  [Symbol.iterator] = this.$map[Symbol.iterator];
  [Symbol.toStringTag] = this.$map[Symbol.toStringTag]

  set(key: K, value: V): this {
    throw new Error('Method not implemented.')
  }
  clear = this.$map.clear.bind(this.$map)
  delete = this.$map.delete.bind(this.$map)
}
