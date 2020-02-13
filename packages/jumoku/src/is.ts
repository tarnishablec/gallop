import { FragmentClip } from './parse'

export const isText = (val: unknown): val is Text => val instanceof Text

export const isDocumentFragment = (val: unknown): val is DocumentFragment =>
  val instanceof DocumentFragment

export const isFunction = (val: unknown): val is Function =>
  val instanceof Function

export const isNodeAttribute = (_val: unknown, front: string): _val is string =>
  /:(([A-Za-z]|-)+)="/.test(front)

export const isFragmentClip = (val: unknown): val is FragmentClip =>
  (val as any)._isClip

export const isStaticClip = (val: unknown): val is FragmentClip =>
  isFragmentClip(val) && val._isStatic

export function isArrayOf<T>(
  vals: unknown,
  isT: (val: unknown) => val is T
): vals is T[] {
  if (Array.isArray(vals)) {
    return isT(vals[0])
  }
  return false
}

export const isDocumentFragmentArray = (
  val: unknown
): val is DocumentFragment[] =>
  isArrayOf<DocumentFragment>(val, isDocumentFragment)
export const isFragmentClipArray = (val: unknown): val is FragmentClip[] =>
  isArrayOf<FragmentClip>(val, isFragmentClip)

export const isStaticClipArray = (val: unknown) => isArrayOf(val, isStaticClip)

export const isFragmentClipOrArray = (
  val: unknown
): val is FragmentClip | FragmentClip[] =>
  isFragmentClip(val) || isFragmentClipArray(val)

export const isObject = <T extends object>(val: T): val is T =>
  val instanceof Object
