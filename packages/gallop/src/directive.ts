import { Part } from './part'
import type { ParamsOf } from './do'

const directives = new WeakSet<object>()

export type DirectiveFn = (part: Part) => unknown

export function isDirective(val: unknown): val is DirectiveFn {
  return val instanceof Function && directives.has(val)
}

export function directive<F extends (...args: any[]) => DirectiveFn>(f: F) {
  return (...args: ParamsOf<F>) => {
    const d = f(...args)
    directives.add(d)
    return d
  }
}
