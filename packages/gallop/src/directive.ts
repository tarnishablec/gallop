import { Part, NodePart } from './part'
import { DirectiveCanNotUseError } from './error'

export const directives = new WeakMap<Function, boolean>()

export type DirectiveFn = (part: Part) => unknown

export function isDirective(val: unknown): val is DirectiveFn {
  return val instanceof Function && directives.has(val)
}

export function directive<F extends (...args: any[]) => DirectiveFn>(
  f: F,
  override: boolean = false
) {
  return ((...args: any[]) => {
    const d = f(...args)
    directives.set(d, override)
    return d
  }) as F
}

export function checkIsNodePart(part: Part): part is NodePart {
  if (!(part instanceof NodePart)) {
    throw DirectiveCanNotUseError(part.type)
  }
  return true
}
