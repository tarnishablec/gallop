import { marker } from './marker'
import { _isProxy } from './reactive'

export function isMarker(str: unknown) {
  return str === marker
}

export function isProxy(val: unknown): val is object {
  return (val instanceof Object && Reflect.get(val, _isProxy)) ?? false
}

export function isIterable(val: unknown): val is Iterable<unknown> {
  return (
    typeof val === 'string' ||
    !!(val instanceof Object && Reflect.get(val, Symbol.iterator))
  )
}
