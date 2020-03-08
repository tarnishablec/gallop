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
import { Part, ShallowPart } from './part'

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

  use() {}

  createInstance() {
    return new Clip(
      this.getShaDof().cloneNode(true) as DocumentFragment,
      this.shallowParts
    )
  }

  placeMarker(cur: string, val: unknown, index: number) {
    let front = cur
    let res
    let part = new ShallowPart(index)
    if (isFragmentClip(val)) {
      res = `${Marker.clip.start}${Marker.clip.end}`
      part.setType('clip')
    } else if (isFragmentClipArray(val) || isEmptyArray(val)) {
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

    this.shallowParts.push(part)
    return `${front}${res ?? ''}`
  }
}

export class Clip {
  dof: DocumentFragment
  parts: Part[]

  constructor(dof: DocumentFragment, shallowParts: ShallowPart[]) {
    this.dof = dof
    this.parts = shallowParts.map(p => p.makeReal())

    this.attachPart()

    // console.log(this.parts)
  }

  update(values: ReadonlyArray<unknown>) {
    // console.log(values)
    this.parts.forEach((part, index) => {
      part.setValue(values[index])
    })

    this.parts.forEach(part => {
      part.commit()
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
        // else{
        //   pre.parentNode?.replaceChild(new Text(pre.wholeText.replace(/(^\s+)|(\s+$)/g,'')),pre)
        // }
      }

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
