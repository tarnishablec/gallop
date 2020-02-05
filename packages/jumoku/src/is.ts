import { FragmentClip } from './parse'

function isDocumentFragment(target: any): target is DocumentFragment {
  return target?.nodeType === Node.DOCUMENT_FRAGMENT_NODE
}

function isFunction(target: any): target is Function {
  return typeof target === 'function'
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

const isDocumentFragmentArray = (targets: any) =>
  isArrayOf<DocumentFragment>(targets, isDocumentFragment)
const isFragmentClipArray = (targets: any) =>
  isArrayOf<FragmentClip>(targets, isFragmentClip)

export {
  isDocumentFragment,
  isFunction,
  isFragmentClip,
  isDocumentFragmentArray,
  isFragmentClipArray
}
