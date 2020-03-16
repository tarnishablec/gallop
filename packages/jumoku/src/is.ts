import { Primitive, OBJ } from './utils'
import { ShallowClip } from './clip'
import { UpdatableElement } from './component'
import { _isProxy } from './reactive'

export const isPrimitive = (val: unknown): val is Primitive =>
  val === null || !(typeof val === 'object' || typeof val === 'function')

export const isText = (val: Node): val is Text =>
  val.nodeType === Node.TEXT_NODE

export const isElement = (val: Node): val is Element =>
  val.nodeType === Node.ELEMENT_NODE

export const isDocumentFragment = (val: unknown): val is DocumentFragment =>
  val instanceof DocumentFragment

export const isEmptyArray = (val: unknown): boolean =>
  val instanceof Array && val.length === 0

export const isNumber = (val: unknown): val is Number =>
  typeof val === 'number' && isFinite(val)

export function isArrayOf<T>(
  vals: unknown,
  isT: (val: unknown) => val is T
): vals is T[] {
  if (Array.isArray(vals) && vals.length) {
    return isT(vals[0])
  }
  return false
}

export const isDocumentFragmentArray = (
  val: unknown
): val is DocumentFragment[] => isArrayOf(val, isDocumentFragment)

export const isFunction = (val: unknown): val is Function =>
  val instanceof Function

export const isFunctions = (val: unknown): val is Function[] =>
  isArrayOf(val, isFunction)

export const isNodeAttribute = (val: unknown, front: string): val is string =>
  /\s\.(([A-Za-z]|-)+)="/.test(front) &&
  (front.lastIndexOf('<') > front.lastIndexOf('>') ||
    /=\s*".*"\s+[A-Za-z]+="/.test(front) ||
    /^"\s+/.test(front))

export const isNodeProp = (val: unknown, front: string): val is String =>
  /\s:(([A-Za-z]|-)+)="$/.test(front) &&
  (front.lastIndexOf('<') > front.lastIndexOf('>') ||
    /=\s*".*"\s+[A-Za-z]+="/.test(front) ||
    /^"\s+/.test(front))

export const isShallowClip = (val: unknown): val is ShallowClip =>
  val instanceof ShallowClip

export const isShallowClipArray = (val: unknown): val is ShallowClip[] =>
  isArrayOf(val, isShallowClip)

export const isObject = <T extends object>(val: T): val is T =>
  val instanceof Object

export const isUpdatableElement = (
  val: unknown
): val is UpdatableElement<OBJ, OBJ> => val instanceof UpdatableElement

export const isProxy = <T extends object>(val: T) =>
  (val as any)[_isProxy] ?? false
