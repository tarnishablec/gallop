import { FragmentClip } from './parse'

function isDocumentFragment(target: unknown): target is DocumentFragment {
  return target instanceof DocumentFragment
}

function isFunction(target: unknown): target is Function {
  return target instanceof Function
}

function isFragmentClip(target: any): target is FragmentClip {
  return isDocumentFragment(target.fragment)
}

function isArrayOf<T>(
  targets: any,
  isT: (target: any) => target is T
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

const isDocumentFragmentArray = (targets: unknown) =>
  isArrayOf<DocumentFragment>(targets, isDocumentFragment)
const isFragmentClipArray = (targets: unknown) =>
  isArrayOf<FragmentClip>(targets, isFragmentClip)

function isFragmentClipOrArray(
  target: unknown
): target is FragmentClip | FragmentClip[] {
  return isFragmentClip(target) || isFragmentClipArray(target)
}

export {
  isDocumentFragment,
  isFunction,
  isFragmentClip,
  isDocumentFragmentArray,
  isFragmentClipArray,
  isFragmentClipOrArray
}
