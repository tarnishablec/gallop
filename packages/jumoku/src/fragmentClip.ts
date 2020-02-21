import {
  isNodeAttribute,
  isFragmentClip,
  isFragmentClipArray,
  isPrimitive,
  isEmptyArray
} from './is'
import { boundAttrRegex } from './regexps'
import { cleanNode, getFragmentContent, replaceSpaceToNbsp } from './utils'
import { boundAttrSuffix } from './attrs'
import { Marker } from './marker'

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
  if (isFragmentClip(val)) {
    res = Marker.clip
  }
  if (isFragmentClipArray(val) || isEmptyArray(val)) {
    res = Marker.clipArray
  }
  if (val && isPrimitive(val) && !isNodeAttribute(val, front)) {
    front = replaceSpaceToNbsp(cur)
    res = Marker.text
  }
  if (isNodeAttribute(val, front)) {
    front = cur.replace(boundAttrRegex, `${boundAttrSuffix}="`)
    res = Marker.attr
  }
  return `${front}${res ?? ''}`
}
