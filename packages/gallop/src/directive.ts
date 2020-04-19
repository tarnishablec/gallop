import { Part, NodePart } from './part'
import type { ParamsOf } from './do'
import { DirectiveCanNotUseError } from './error'
import { VirtualElement } from './component'
import { Clip } from './clip'

export const directives = new WeakMap<object, boolean>()

export type DirectiveFn = (
  part: Part
) =>
  | (Clip | string | VirtualElement)[]
  | string
  | Clip
  | VirtualElement
  | DirectiveFn

export function isDirective(val: unknown): val is DirectiveFn {
  return val instanceof Function && directives.has(val)
}

export function directive<F extends (...args: any[]) => DirectiveFn>(
  f: F,
  override: boolean = false
) {
  return (...args: ParamsOf<F>) => {
    const d = f(...args)
    directives.set(d, override)
    return d
  }
}

export function checkIsNodePart(part: Part) {
  if (!(part instanceof NodePart)) {
    throw DirectiveCanNotUseError
  }
}
