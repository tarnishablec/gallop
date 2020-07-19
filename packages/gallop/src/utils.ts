import { marker } from './marker'

export type Primitive =
  | number
  | string
  | symbol
  | undefined
  | null
  | boolean
  | bigint

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#null
 */
export function isObject<T extends object = object>(
  target: unknown
): target is T & object {
  return target !== null && typeof target === 'object'
}

export type Obj = Record<string, unknown>
export type Key = Exclude<Primitive, null | boolean | bigint | undefined>

export function tryParseToString(val: unknown): string {
  if (val === undefined || val === null) return ''
  if (typeof val === 'string') return val
  if (
    typeof val === 'function' ||
    typeof val === 'symbol' ||
    typeof val === 'number'
  )
    return String(val)
  return JSON.stringify(val)
}

export function keysOf<T>(val: T) {
  return Object.keys(val) as Array<keyof T>
}

export function shallowEqual(objA: unknown, objB: unknown) {
  if (Object.is(objA, objB)) return true
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  const keysA = keysOf(objA)
  const keysB = keysOf(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!(keysA[i] in objB) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }
  return true
}

export function extractProps(attrs: NamedNodeMap) {
  return Array.from(attrs)
    .filter((a) => /^:\S+/.test(a.name) && a.value !== marker)
    .reduce((acc, { name, value }) => {
      let v: string | boolean
      if (value === '') {
        v = true
      } else if (value === "''") {
        v = ''
      } else {
        v = value
      }
      Reflect.set(acc, name.slice(1), v)
      return acc
    }, {} as Obj)
}

/**
 * https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 */
export const hashify = (str: string) =>
  [...str].reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

export type MapTypes<V = unknown> = Map<unknown, V> | WeakMap<object, V>
export type MapKey<T extends MapTypes> = T extends WeakMap<infer WK, unknown>
  ? WK
  : T extends Map<infer K, unknown>
  ? K
  : never
export type MapValue<T> = T extends MapTypes<infer V> ? V : never

export type SetTypes = Set<unknown> | WeakSet<object>
export type SetItem<T extends SetTypes> = T extends WeakSet<infer WV>
  ? WV
  : T extends Set<infer V>
  ? V
  : never

export type StrongTypes = Map<unknown, unknown> | Set<unknown>
export type WeakTypes = WeakMap<object, unknown> | WeakSet<object>

export type DeleteItem<T extends MapTypes | SetTypes> = T extends WeakTypes
  ? object
  : unknown

export function forceGet<T extends MapTypes, V>(
  map: T,
  key: MapKey<T>,
  func: () => V
): V {
  const v = map.get(key)
  if (v) return v as V
  const val = func()
  map.set(key, val)
  return val
}
