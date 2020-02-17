import { Primitive } from './utils'

export const isPrimitive = (value: unknown): value is Primitive =>
  value === null || !(typeof value === 'object' || typeof value === 'function')

export const isText = (val: Node): val is Text =>
  val.nodeType === Node.TEXT_NODE

export const isElement = (val: Node): val is Element =>
  val.nodeType === Node.ELEMENT_NODE

export const isEmptyArray = (val: Array<unknown>): boolean => val.length === 0

export const isDocumentFragment = (val: unknown): val is DocumentFragment =>
  val instanceof DocumentFragment

export const isFunction = (val: unknown): val is Function =>
  val instanceof Function

export const isNodeAttribute = (_val: unknown, front: string): _val is string =>
  /:(([A-Za-z]|-)+)="/.test(front)

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

export const isObject = <T extends object>(val: T): val is T =>
  val instanceof Object
