import {
  isNodeAttribute,
  isFragmentClip,
  isFragmentClipArray,
  isPrimitive,
  isEmptyArray,
  isFunction,
  isNodeProp,
  isElement
} from './is'
import { replaceSpaceToZwnj, createTreeWalker } from './utils'
import { Marker } from './marker'
import { Part, NoPart, ClipPart, PorpPart, AttrPart } from './part'

const range = document.createRange()

const shallowDofCache = new Map<string, DocumentFragment>()

export class ShallowClip {
  readonly strs: TemplateStringsArray
  readonly vals: unknown[]
  readonly shallowHtml: string

  shallowParts: Part[] = []

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.strs = strs
    this.vals = vals
    this.shallowHtml = this.getShaHtml()
  }

  getShaHtml() {
    return this.strs
      .reduce(
        (acc, cur, index) =>
          `${acc}${this.placeMarker(cur, this.vals[index], index)}`,
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

  createInstance() {
    return new Clip(
      this.getShaDof().cloneNode(true) as DocumentFragment,
      this.shallowParts
    )
  }

  placeMarker(cur: string, val: unknown, index: number) {
    let front = cur
    let res
    let part = new NoPart(index)
    if (isFragmentClip(val)) {
      res = `${Marker.clip.start}${Marker.clip.end}`
      part = new ClipPart(index)
    } else if (isFragmentClipArray(val) || isEmptyArray(val)) {
      res = `${Marker.clips.start}${Marker.clips.end}`
    } else if (isNodeProp(val, front)) {
      res = Marker.prop
      part = new PorpPart(index)
    } else if (isNodeAttribute(val, front)) {
      res = Marker.attr
      part = new AttrPart(index)
    } else if (val && isPrimitive(val)) {
      front = replaceSpaceToZwnj(cur)
      res = Marker.text
    } else if (isFunction(val)) {
      res = Marker.func
    }

    val && this.shallowParts.push(part)
    return `${front}${res ?? ''}`
  }
}

export class Clip {
  dof: DocumentFragment
  parts: Part[]

  constructor(dof: DocumentFragment, shallowParts: Part[]) {
    this.dof = dof
    this.parts = shallowParts.map(p => p.clone())

    this.attachPart()
    console.log(this.parts)
  }

  attachPart() {
    const walker = createTreeWalker(this.dof)
    let count = 0

    while (count < this.parts.length) {
      walker.nextNode()
      let cur = walker.currentNode as Element | Comment | null
      if (cur === null) {
        break
      }
      if (isElement(cur)) {
        const attributes = cur.attributes
        const attrLength = attributes.length

        for (let i = 0; i < attrLength; i++) {
          let name = attributes[0].name
          let prefix = name[0]
          if (prefix === '.' || prefix === ':' || prefix === '@') {
            this.parts[count]?.setLocation({ node: cur, name: name.slice(1) })
            count++
          }
        }
      } else if (cur instanceof Comment) {
        const type = cur.data.match(/\$(\S*)\$/)?.[1]
        if (type === 'cliphead' || type === 'clipshead') {
          this.parts[count]?.setLocation({
            startNode: cur,
            endNode: cur.nextSibling!
          })
        }
        walker.nextNode()
        count++
      }
    }
  }
}
