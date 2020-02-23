import {
  isNodeAttribute,
  isFragmentClip,
  isFragmentClipArray,
  isPrimitive,
  isEmptyArray,
  isFunction
} from './is'
import { cleanNode, getFragmentContent, replaceSpaceToZwnj } from './utils'
import { boundAttrSuffix, boundAttrRegex } from './attrs'
import { Marker } from './marker'

const range = document.createRange()

export class FragmentClip {
  readonly strs: TemplateStringsArray
  readonly vals: unknown[]

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

  getDof() {
    // let template = document.createElement('template')
    // template.innerHTML = getFragmentContent(
    return cleanNode(range.createContextualFragment(this.getHtml()))
    // )
    // return template
  }

  use(a: any) {
    return this
  }
}

function placeMarker(cur: string, val: unknown) {
  let front = cur
  let res = val
  if (isFragmentClip(val)) {
    res = Marker.clip
  } else if (isFragmentClipArray(val) || isEmptyArray(val)) {
    res = Marker.clipArray
  } else if (isNodeAttribute(val, front)) {
    front = cur.replace(boundAttrRegex, `${boundAttrSuffix}="`)
    res = Marker.attr
  } else if (val && isPrimitive(val)) {
    front = replaceSpaceToZwnj(cur)
    res = Marker.text
  } else if (isFunction(val)) {
    res = Marker.func
  }
  return `${front}${res ?? ''}`
}
