import { Primitive } from './utils'
import { FragmentClip } from './fragmentClip'

export const isPrimitive = (value: unknown): value is Primitive =>
  value === null || !(typeof value === 'object' || typeof value === 'function')

export const isText = (val: Node): val is Text =>
  val.nodeType === Node.TEXT_NODE

export const isElement = (val: Node): val is Element =>
  val.nodeType === Node.ELEMENT_NODE

export const isEmptyArray = (val: unknown): boolean =>
  val instanceof Array && val.length === 0

export function isArrayOf<T>(
  vals: unknown,
  isT: (val: unknown) => val is T
): vals is T[] {
  if (Array.isArray(vals)) {
    return isT(vals[0])
  }
  return false
}

export const isDocumentFragment = (val: unknown): val is DocumentFragment =>
  val instanceof DocumentFragment

export const isDocumentFragmentArray = (
  val: unknown
): val is DocumentFragment[] => isArrayOf(val, isDocumentFragment)

export const isFunction = (val: unknown): val is Function =>
  val instanceof Function

export const isNodeAttribute = (val: unknown, front: string): val is string =>
  /\s:(([A-Za-z]|-)+)="/.test(front) &&
  front.lastIndexOf('<') > front.lastIndexOf('>')

export const isFragmentClip = (val: unknown): val is FragmentClip =>
  val instanceof FragmentClip

export const isFragmentClipArray = (val: unknown): val is FragmentClip[] =>
  isArrayOf(val, isFragmentClip)

export const isObject = <T extends object>(val: T): val is T =>
  val instanceof Object
