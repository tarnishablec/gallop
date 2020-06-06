import { Part } from './part'

export const directives = new WeakMap<Function, boolean>()

export type DirectiveFn = (part: Part) => unknown

export function isDirective(val: unknown): val is DirectiveFn {
  return val instanceof Function && directives.has(val)
}

export function directive<F extends (...args: any) => DirectiveFn>(
  f: F,
  override: boolean = false
) {
  return ((...args: any) => {
    const d = f(...args)
    directives.set(d, override)
    return d
  }) as F
}

export function checkDirective(val: unknown, part: Part): [unknown, boolean] {
  let pendingVal = val
  let isOverrided = false
  while (isDirective(pendingVal)) {
    if (directives.get(pendingVal)) {
      isOverrided = true
    }
    pendingVal = pendingVal(part)
  }
  return [pendingVal, isOverrided]
}
