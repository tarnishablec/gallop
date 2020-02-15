import { isEmptyArray } from './is'
import { cleanNode } from './utils'

const range = document.createRange()

export function html(
  strs: TemplateStringsArray,
  ...vals: unknown[]
): DocumentFragment {
  console.log(strs)
  let raw = strs
    .reduce(
      (acc, cur, index) => `${acc}${cur}${vals[index] ?? ''}`,
      ''
    )
    .trim()
  return isEmptyArray(vals)
    ? cleanNode(range.createContextualFragment(raw))
    : document.createDocumentFragment()
}
