import { marker } from './marker'
import { _isProxy } from './reactive'
import type { Primitive } from './utils' //ts 3.8.3 import type

export function isMarker(str: string) {
  return str === marker
}

export function isProxy(val: unknown): val is object {
  return (val instanceof Object && Reflect.get(val, _isProxy)) ?? false
}

export function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    !(typeof value === 'object' || typeof value === 'function')
  )
}
