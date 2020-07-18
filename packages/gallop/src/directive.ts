import { Part } from './part'

export const directives = new WeakSet()

export type DirectiveFn = (part: Part) => unknown

export function isDirective(val: unknown): val is DirectiveFn {
  return typeof val === 'function' && directives.has(val)
}

export function directive<F extends (...args: any[]) => DirectiveFn>(f: F) {
  return ((...args: any[]) => {
    const d = f(...args)
    directives.add(d)
    return d
  }) as F
}

export function resolveDirective(val: unknown, part: Part) {
  let isOverridden = false
  while (isDirective(val)) {
    isOverridden = true
    val = val(part)
  }
  return isOverridden
}
