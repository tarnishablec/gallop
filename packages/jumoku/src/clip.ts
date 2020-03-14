import {
  isNodeAttribute,
  isShallowClip,
  isShallowClipArray,
  isPrimitive,
  isEmptyArray,
  isFunction,
  isNodeProp,
  isElement,
  isFunctions
} from './is'
import { replaceSpaceToZwnj, createTreeWalker, OBJ } from './utils'
import { Marker } from './marker'
import {
  Part,
  PartType,
  PartLocation,
  TextPart,
  AttrPart,
  AttrEventLocation,
  PropLocation,
  PorpPart,
  EventPart,
  EventInstance,
  TextLocation,
  ClipPart,
  clipLocation,
  ClipsPart
} from './part'
import { StyleClip } from './parse'
import { NoTypePartError } from './error'
import { UpdatableElement } from './component'
import { Context } from './context'

const range = document.createRange()

const shallowDofCache = new Map<string, DocumentFragment>()

export class ShallowClip {
  readonly strs: TemplateStringsArray
  readonly vals: unknown[]
  readonly shallowHtml: string

  key: unknown = null

  contexts: Context<OBJ>[] = []
  shallowParts: PartType[] = []

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
    let clip = new Clip(
      this.getShaDof().cloneNode(true) as DocumentFragment,
      this.shallowHtml,
      this.shallowParts,
      this.vals,
      this.key
    )
    this.contexts.forEach(c => {
      c.watch(clip)
    })
    return clip
  }

  useStyle(style: StyleClip) {
    return style
  }

  useKey(key: unknown) {
    this.key = key
    return this
  }

  useContext(contexts: Context<OBJ>[]) {
    this.contexts = contexts
    return this
  }

  placeMarker(cur: string, val: unknown, index: number, length: number) {
    let front = cur
    let res
    let partType: PartType = 'no'
    let isTail = index === length - 1

    if (isShallowClip(val)) {
      res = `${Marker.clip.start}${Marker.clip.end}`
      partType = 'clip'
    } else if (isFunction(val) || isFunctions(val)) {
      res = Marker.func
      partType = 'event'
    } else if (isShallowClipArray(val) || isEmptyArray(val)) {
      res = `${Marker.clips.start}${Marker.clips.end}`
      partType = 'clips'
    } else if (isNodeProp(val, front)) {
      res = Marker.prop
      partType = 'prop'
    } else if (isNodeAttribute(val, front)) {
      res = Marker.attr
      partType = 'attr'
    } else if (isPrimitive(val)) {
      front = replaceSpaceToZwnj(cur)
      res = Marker.text
      partType = 'text'
    }

    !isTail && this.shallowParts.push(partType)
    return `${front}${isTail ? '' : res}`
  }
}

export class Clip {
  dof: DocumentFragment
  html: string
  shallowParts: PartType[]
  parts: Part[] = []
  initVals: unknown[]
  key: unknown

  elementInstance?: UpdatableElement<any>

  constructor(
    dof: DocumentFragment,
    html: string,
    shallowParts: PartType[],
    initVals: unknown[],
    key: unknown
  ) {
    this.key = key
    this.dof = dof
    this.html = html
    this.initVals = initVals
    this.shallowParts = shallowParts
    this.attachPart()

    // console.log(this.parts)
  }

  init() {
    this.parts.forEach(part => {
      part.init()
    })
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

    while (count < this.initVals.length) {
      walker.nextNode()
      let cur = walker.currentNode

      if (cur === null) {
        break
      }

      if (cur.previousSibling instanceof Text) {
        let pre = cur.previousSibling
        if (/^\s*$/.test(pre.wholeText)) {
          pre.parentNode?.removeChild(pre)
        }
      }

      if (isElement(cur)) {
        const attributes = cur.attributes
        const { length } = attributes

        for (let i = 0; i < length; i++) {
          let name = attributes[i].name
          let prefix = name[0]
          if (prefix === '.' || prefix === ':' || prefix === '@') {
            const n = name.slice(1)
            let p = createPart(
              count,
              this.shallowParts[count],
              this.initVals[count],
              { node: cur, name: n }
            )
            this.parts.push(p)
            count++
          }
        }
      } else if (cur instanceof Comment) {
        const type = cur.data.match(/\$(\S*)\$/)?.[1]
        if (type === 'cliphead' || type === 'clipshead') {
          let p = createPart(
            count,
            this.shallowParts[count],
            this.initVals[count] as ShallowClip,
            {
              startNode: cur,
              endNode: cur.nextSibling! as Comment
            }
          )
          this.parts.push(p)
          walker.nextNode()
        } else if (type === 'text') {
          let p = createPart(
            count,
            this.shallowParts[count],
            this.initVals[count],
            {
              node: cur
            }
          )
          this.parts.push(p)
        }
        count++
      }
    }
  }
}

const createPart = (
  index: number,
  type: PartType,
  initVal: unknown,
  location: PartLocation
) => {
  switch (type) {
    case 'text':
      return new TextPart(index, initVal as string, location as TextLocation)
    case 'attr':
      return new AttrPart(
        index,
        initVal as string,
        location as AttrEventLocation
      )
    case 'prop':
      return new PorpPart(index, initVal, location as PropLocation)
    case 'event':
      return new EventPart(
        index,
        initVal as EventInstance | EventInstance[],
        location as AttrEventLocation
      )
    case 'clip':
      return new ClipPart(
        index,
        initVal as ShallowClip,
        location as clipLocation
      )
    case 'clips':
      return new ClipsPart(
        index,
        initVal as ShallowClip[],
        location as clipLocation
      )
    default:
      throw NoTypePartError
  }
}
