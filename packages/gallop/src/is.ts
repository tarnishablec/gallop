import { marker } from './marker'
import { _isProxy } from './reactive'

export function isMarker(str: unknown) {
  return str === marker
}

export function isProxy(val: unknown): boolean {
  return (val instanceof Object && Reflect.get(val, _isProxy)) ?? false
}
