export type Primitive =
  | number
  | string
  | symbol
  | undefined
  | null
  | boolean
  | bigint

export type Key = Exclude<Primitive, null | undefined | boolean>
export type Obj = Record<string, unknown>

export function tryParseToString(val: unknown): string {
  if (
    val === undefined ||
    typeof val === 'string' ||
    typeof val === 'function' ||
    typeof val === 'symbol' ||
    typeof val === 'number'
  )
    return String(val)
  if (val === null) return ''
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
