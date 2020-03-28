import { marker } from './marker'
import { _isProxy } from './reactive'

export function isMarker(str: string) {
  return str === marker
}

export function isObject(val: unknown): val is Object {
  return val instanceof Object
}

export function isFunction(val: unknown): val is Function {
  return val instanceof Function
}

export function isProxy(val: object): boolean {
  return Reflect.get(val, _isProxy) ?? false
}
