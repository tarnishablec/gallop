import { marker } from './marker'
import { _isProxy } from './reactive'
import type { Primitive } from './utils' //ts 3.8.3 import type

export function isMarker(str: string) {
  return str === marker
}

export function isObject(val: unknown): val is Object {
  return val instanceof Object
}

export function isFunction(val: unknown): val is Function {
  return val instanceof Function
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
