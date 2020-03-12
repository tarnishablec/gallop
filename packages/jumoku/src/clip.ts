import {
  isNodeAttribute,
  isShallowClip,
  isShallowClipArray,
  isPrimitive,
  isEmptyArray,
  isFunction,
  isNodeProp,
  isElement
} from './is'
import { replaceSpaceToZwnj, createTreeWalker } from './utils'
import { Marker } from './marker'
import { Part, ShallowPart } from './part'
import { StyleClip } from './parse'

const range = document.createRange()

const shallowDofCache = new Map<string, DocumentFragment>()

export class ShallowClip {
  readonly strs: TemplateStringsArray
  readonly vals: unknown[]
  readonly shallowHtml: string

  shallowParts: ShallowPart[] = []

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.strs = strs
    this.vals = vals
    this.shallowHtml = this.getShaHtml()
  }

  getShaHtml() {
    return this.strs
      .reduce(
        (acc, cur, index) =>
          `${acc}${this.placeMarker(
            cur,
            this.vals[index],
            index,
            this.strs.length
          )}`,
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
      this.shallowHtml,
      this.shallowParts
    )
  }

  useStyle(style: StyleClip) {
    return style
  }

  placeMarker(cur: string, val: unknown, index: number, length: number) {
    let front = cur
    let res
    let part = new ShallowPart(index)
    let isTail = index === length - 1

    if (isShallowClip(val)) {
      res = `${Marker.clip.start}${Marker.clip.end}`
      part.setType('clip')
    } else if (isShallowClipArray(val) || isEmptyArray(val)) {
      res = `${Marker.clips.start}${Marker.clips.end}`
      part.setType('clips')
    } else if (isNodeProp(val, front)) {
      res = Marker.prop
      part.setType('prop')
    } else if (isNodeAttribute(val, front)) {
      res = Marker.attr
      part.setType('attr')
    } else if (isPrimitive(val)) {
      front = replaceSpaceToZwnj(cur)
      res = Marker.text
      part.setType('text')
    } else if (isFunction(val)) {
      res = Marker.func
      part.setType('event')
    }

    !isTail && this.shallowParts.push(part)
    return `${front}${isTail ? '' : res}`
  }
}

export class Clip {
  dof: DocumentFragment
  html: string
  parts: Part[] = []

  constructor(
    dof: DocumentFragment,
    html: string,
    shallowParts: ShallowPart[]
  ) {
    this.dof = dof
    this.html = html
    this.parts = shallowParts.map(p => p.makeReal())

    this.attachPart()

    // console.log(this.parts)
  }

  update(values: ReadonlyArray<unknown>) {
    // console.log(values)
    this.parts.forEach((part, index) => {
      part.setValue(values[index])
    })
  }

  private attachPart() {
    const walker = createTreeWalker(this.dof)
    let count = 0

    while (count < this.parts.length) {
      walker.nextNode()
      let cur = walker.currentNode

      if (cur.previousSibling instanceof Text) {
        let pre = cur.previousSibling
        if (/^\s*$/.test(pre.wholeText)) {
          pre.parentNode?.removeChild(pre)
        }
      }

      if (cur === null) {
        break
      }

      if (isElement(cur)) {
        const attributes = cur.attributes
        const attrLength = attributes.length

        for (let i = 0; i < attrLength; i++) {
          let name = attributes[i].name
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
            endNode: cur.nextSibling! as Comment
          })
          walker.nextNode()
        } else if (type === 'text') {
          this.parts[count]?.setLocation({ textNodePre: cur })
        }
        count++
      }
    }
  }
}
