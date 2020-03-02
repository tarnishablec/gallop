import {
  isNodeAttribute,
  isFragmentClip,
  isFragmentClipArray,
  isPrimitive,
  isEmptyArray,
  isFunction,
  isBindingProp,
  isStaticProp
} from './is'
import { replaceSpaceToZwnj, createTreeWalker } from './utils'
import { Marker } from './marker'
import { Context } from './context'
import { Hooks } from './hooks'
import { Part } from './part'

const range = document.createRange()

const shallowDofCache = new Map<string, DocumentFragment>()

export class Clip {
  readonly strs: TemplateStringsArray
  readonly vals: unknown[]
  readonly shallowHtml: string

  parts: Part[] = []

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.strs = strs
    this.vals = vals
    this.shallowHtml = this.getShaHtml()

    const walker = createTreeWalker(this.getShaDof())
    
  }

  getShaHtml() {
    return this.strs
      .reduce(
        (acc, cur, index) => `${acc}${this.placeMarker(cur, this.vals[index])}`,
        ''
      )
      .trim()
  }

  getShaDof() {
    return (
      shallowDofCache.get(this.shallowHtml) ??
      shallowDofCache
        .set(this.shallowHtml, range.createContextualFragment(this.shallowHtml))
        .get(this.shallowHtml)!
    )
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

  placeMarker(cur: string, val: unknown) {
    let front = cur
    let res
    if (isFragmentClip(val)) {
      res = `${Marker.clip.start}${Marker.clip.end}`
    } else if (isFragmentClipArray(val) || isEmptyArray(val)) {
      res = `${Marker.clips.start}${Marker.clips.end}`
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
}

export interface ShallowPart<T> {
  index: number
  type: T
}
