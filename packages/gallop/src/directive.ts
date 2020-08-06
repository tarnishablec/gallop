import { Part } from './part'
import { DirectivePartTypeError } from './error'
import { Recycler } from './dirty'

export const directives = new WeakSet()

export type DirectiveFn = (part: Part) => unknown

export function isDirective(val: unknown): val is DirectiveFn {
  return typeof val === 'function' && directives.has(val)
}

export function directive<T extends (...args: any[]) => DirectiveFn>(f: T) {
  return ((...args: any[]) => {
    const d = f(...args)
    directives.add(d)
    return d
  }) as T
}

export function resolveDirective(val: unknown, part: Part) {
  let isOverridden = false
  while (isDirective(val)) {
    isOverridden = true
    val = val(part)
  }
  return isOverridden
}

export function ensurePartType<T extends Part>(
  part: Part,
  partCtor: new (...args: any[]) => T
): part is T {
  if (!(part instanceof partCtor))
    throw DirectivePartTypeError(part.constructor.name)
  return true
}

const partDependsCache = new WeakMap<Part, undefined | unknown[]>()
export function checkDependsDirty(part: Part, depends?: unknown[]): boolean {
  if (!depends) return true
  const oldDeps = partDependsCache.get(part)
  partDependsCache.set(part, depends)
  if (oldDeps === void 0) return true
  return Recycler.compareDepends(oldDeps, depends)
}
