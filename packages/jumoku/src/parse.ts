import {
  isEmptyArray,
  isDocumentFragmentArray,
  isDocumentFragment,
  isNodeAttribute,
  isFunction
} from './is'
import { cleanNode, getFragmentContent, marker } from './utils'

const range = document.createRange()

let flagIndex = 0

export function html(
  strs: TemplateStringsArray,
  ...vals: unknown[]
): DocumentFragment {
  let raw = strs
    .reduce(
      (acc, cur, index) =>
        `${acc}${cur}${placeMarker(vals[index], index, cur)}`,
      ''
    )
    .trim()
  return cleanNode(range.createContextualFragment(raw))
}

function placeMarker(val: unknown, index: number, front: string) {
  if (val === undefined || null) {
    return ''
  }
  if (isDocumentFragment(val) || isDocumentFragmentArray(val)) {
    ///first mounted
    return `<!--dof-->`
  }
  if (isNodeAttribute(val, front)) {
    return `<!--attr-->`
  }
  if (isFunction(val)) {
    return val
  }
  return val
}

export class FragmentClip {
  private readonly strings: TemplateStringsArray
  private readonly vals: ReadonlyArray<unknown>

  constructor(strings: TemplateStringsArray, vals: unknown[]) {
    this.strings = strings
    this.vals = vals
  }

  generateTemplate() {}
}
