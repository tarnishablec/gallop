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
  return isDocumentFragment((target as any).fragment)
}

export function isArrayOf<T>(
  targets: unknown,
  isT: (target: unknown) => target is T
): targets is T[] {
  if (Array.isArray(targets)) {
    targets.forEach(t => {
      if (!isT(t)) {
        return false
      }
    })
    return true
  }
  return false
}

export const isDocumentFragmentArray = (targets: unknown) =>
  isArrayOf<DocumentFragment>(targets, isDocumentFragment)
export const isFragmentClipArray = (targets: unknown) =>
  isArrayOf<FragmentClip>(targets, isFragmentClip)

export function isFragmentClipOrArray(
  target: unknown
): target is FragmentClip | FragmentClip[] {
  return isFragmentClip(target) || isFragmentClipArray(target)
}

export function isObject(target: unknown): target is object {
  return target instanceof Object
}
