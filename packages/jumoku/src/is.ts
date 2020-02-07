import { FragmentClip } from './parse'

export function isText(target: unknown): target is Text {
  return target instanceof Text
}

export function isDocumentFragment(
  target: unknown
): target is DocumentFragment {
  return target instanceof DocumentFragment
}

export function isFunction(target: unknown): target is Function {
  return target instanceof Function
}

export function isFragmentClip(target: unknown): target is FragmentClip {
  return (target as any)._isClip
}

export function isStaticClip(target: unknown): target is FragmentClip {
  return isFragmentClip(target) && target._isStatic
}

export function isArrayOf<T>(
  targets: unknown,
  isT: (target: unknown) => target is T
): targets is T[] {
  if (Array.isArray(targets)) {
    return isT(targets[0])
    // targets.forEach(t => {
    //   if (!isT(t)) {
    //     return false
    //   }
    // })
    // return true
  }
  return false
}

export const isDocumentFragmentArray = (
  target: unknown
): target is DocumentFragment[] =>
  isArrayOf<DocumentFragment>(target, isDocumentFragment)
export const isFragmentClipArray = (
  target: unknown
): target is FragmentClip[] => isArrayOf<FragmentClip>(target, isFragmentClip)

export const isStaticClipArray = (target: unknown) =>
  isArrayOf(target, isStaticClip)

export function isFragmentClipOrArray(
  target: unknown
): target is FragmentClip | FragmentClip[] {
  return isFragmentClip(target) || isFragmentClipArray(target)
}

export function isObject(target: unknown): target is object {
  return target instanceof Object
}
