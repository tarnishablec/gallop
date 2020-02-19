import {
  isDocumentFragment,
  isDocumentFragmentArray,
  isNodeAttribute,
  isFragmentClip,
  isFragmentClipArray
} from './is'
import { boundAttrRegex } from './regexps'
import { cleanNode, generateMarker, getFragmentContent } from './utils'
import { boundAttrSuffix } from './attrs'

export const marker = generateMarker()
const markerComment = `<!--${marker}-->`

const range = document.createRange()

export class FragmentClip {
  readonly strs: TemplateStringsArray
  readonly vals: ReadonlyArray<unknown>

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.strs = strs
    this.vals = vals
  }

  getHtml() {
    return this.strs
      .reduce(
        (acc, cur, index) => `${acc}${placeMarker(cur, this.vals[index])}`,
        ''
      )
      .trim()
  }

  getTemplate() {
    let template = document.createElement('template')
    template.innerHTML = getFragmentContent(
      cleanNode(range.createContextualFragment(this.getHtml()))
    )
    return template
  }

  useEffect(a: any) {
    return this
  }
}

function placeMarker(cur: string, val: unknown) {
  let front = cur
  let res = val
  if (isFragmentClip(val) || isFragmentClipArray(val)) {
    res = markerComment
  }
  if (isNodeAttribute(val, front)) {
    front = cur.replace(boundAttrRegex, `${boundAttrSuffix}="`)
    res = marker
  }
  return `${front}${res ?? ''}`
}
