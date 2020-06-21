import { Part } from './part'

export const directives = new WeakSet()

export type DirectiveFn = (part: Part) => void

export function isDirective(val: unknown): val is DirectiveFn {
  return val instanceof Function && directives.has(val)
}

export function directive<F extends (...args: any[]) => DirectiveFn>(f: F) {
  return ((...args: any[]) => {
    const d = f(...args)
    directives.add(d)
    return d
  }) as F
}

export function resolveDirective(val: unknown, part: Part) {
  let isOverrided = false
  while (isDirective(val)) {
    isOverrided = true
    val = val(part)
  }
  return isOverrided
}
