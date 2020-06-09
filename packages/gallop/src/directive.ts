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

export function resolveDirective(val: unknown, part: Part): [boolean] {
  part.pendingValue = val
  let isOverrided = false
  while (isDirective(part.pendingValue)) {
    if (directives.get(part.pendingValue)) {
      isOverrided = true
    }
    part.pendingValue = part.pendingValue(part)
  }
  return [isOverrided]
}
