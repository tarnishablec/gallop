import {
  isNodeAttribute,
  isFragmentClip,
  isFragmentClipArray,
  isPrimitive,
  isEmptyArray,
  isFunction
} from './is'
import { cleanNode, replaceSpaceToZwnj } from './utils'
import { boundAttrSuffix, boundAttrRegex } from './attrs'
import { Marker } from './marker'
import { Context } from './context'
import { Part } from './part'
import { Hooks } from './hooks'

const range = document.createRange()

export class FragmentClip {
  readonly strs: TemplateStringsArray
  readonly vals: unknown[]
  readonly rawHtml: string
  parts: Part[]
  dof: DocumentFragment

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.strs = strs
    this.vals = vals
    this.rawHtml = this.getHtml()
    this.dof = this.getDof()
    this.parts = []
  }

  private getHtml() {
    return this.strs
      .reduce(
        (acc, cur, index) => `${acc}${placeMarker(cur, this.vals[index])}`,
        ''
      )
      .trim()
  }

  getDof() {
    return cleanNode(range.createContextualFragment(this.rawHtml))
  }

  use<T extends object>(target: Context<T> | Hooks) {
    if (target instanceof Context) {
      target.watch(this)
      console.log(target)
    } else {
    }
    return this
  }

  mount() {}

  update() {}
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
