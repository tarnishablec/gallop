import {
  isNodeAttribute,
  isFragmentClip,
  isFragmentClipArray,
  isPrimitive,
  isEmptyArray,
  isFunction,
  isElement,
  isBindingProp,
  isStaticProp
} from './is'
import { replaceSpaceToZwnj } from './utils'
import { Marker } from './marker'
import { Context } from './context'
import { Part } from './part'
import { Hooks } from './hooks'
import { createTreeWalker } from './utils'

const range = document.createRange()

export class Clip {
  readonly strs: TemplateStringsArray
  readonly vals: unknown[]
  readonly shallowHtml: string
  readonly shallowDof: DocumentFragment

  partMap: Part[]

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.strs = strs
    this.vals = vals
    this.shallowHtml = this.getShaHtml()
    this.shallowDof = this.getShaDof()
    this.partMap = []

    const walker = createTreeWalker(this.shallowDof)

    while (walker.nextNode()) {
      let cur = walker.currentNode as Element | Text | Comment
      if (isElement(cur)) {
        let attrs = cur.attributes
        let length = attrs.length
        for (let i = 0; i < length; i++) {
          let attr = attrs[i]
          if (attr.name.startsWith(':')) {
            console.dir(cur) //binding props
            console.log(cur.getAttribute(attrs[i].name))
          } else if (attr.name.startsWith('.')) {
          }
        }
      }
    }
  }

  getShaHtml() {
    return this.strs
      .reduce(
        (acc, cur, index) =>
          `${acc}${placeMarker(cur, this.vals[index], index)}`,
        ''
      )
      .trim()
  }

  getShaDof() {
    let res = range.createContextualFragment(this.shallowHtml)
    return res
  }

  use<T extends object>(target: Context<T> | Hooks) {
    if (target instanceof Context) {
      target.watch(this)
    } else {
    }
    return this
  }

  mount() {}

  update() {}
}

function placeMarker(cur: string, val: unknown, index: number) {
  let front = cur
  let res = val
  if (isFragmentClip(val)) {
    res = Marker.clip
  } else if (isFragmentClipArray(val) || isEmptyArray(val)) {
    res = Marker.clips
  } else if (isBindingProp(val, front)) {
    res = Marker.prop.binding
  } else if (isStaticProp(val, front)) {
    res = Marker.prop.static
  } else if (isNodeAttribute(val, front)) {
    res = Marker.attr
  } else if (val && isPrimitive(val)) {
    front = replaceSpaceToZwnj(cur)
    res = Marker.text
  } else if (isFunction(val)) {
    res = Marker.func
  }
  return `${front}${res ?? ''}`
}
