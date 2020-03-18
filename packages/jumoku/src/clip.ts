import {
  isNodeAttribute,
  isShallowClip,
  isShallowClipArray,
  isPrimitive,
  isEmptyArray,
  isFunction,
  isNodeProp,
  isElement,
  isFunctions,
  isMarker
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
import { NoTypePartError, TemplateSyntaxError } from './error'
import { UpdatableElement } from './component'
import { Context } from './context'

const range = document.createRange()

const shallowDofCache = new Map<string, DocumentFragment>()

export class ShallowClip {
  private readonly strs: TemplateStringsArray
  private readonly vals: unknown[]
  private readonly shallowHtml: string

  private key: unknown = null

  private contexts: Context<OBJ>[] = []
  private effects: Function[] = []
  private shallowParts: PartType[] = [] //ts 3.8.3 feature #shallowParts can not pass lint-staged

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.strs = strs
    this.vals = vals
    this.shallowHtml = this.initShaHtml()
  }

  private initShaHtml() {
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

  _getShaHtml() {
    return this.shallowHtml
  }
  _getVals() {
    return this.vals
  }

  private _getShaDof() {
    return (
      shallowDofCache.get(this.shallowHtml) ??
      shallowDofCache
        .set(this.shallowHtml, range.createContextualFragment(this.shallowHtml))
        .get(this.shallowHtml)!
    )
  }

  _createShallowInstance() {
    return new Clip(
      this._getShaDof() as DocumentFragment,
      this.shallowHtml,
      this.shallowParts,
      this.vals,
      this.key,
      this.contexts
    )
  }

  _createInstance() {
    return new Clip(
      this._getShaDof().cloneNode(true) as DocumentFragment,
      this.shallowHtml,
      this.shallowParts,
      this.vals,
      this.key,
      this.contexts
    )
  }

  // useStyle(style: StyleClip) {
  //  TODO
  // return this
  // }

  useKey(key: unknown) {
    this.key = key
    //TODO
    return this
  }

  useEffect() {}

  useContext(contexts: Context<OBJ>[]) {
    this.contexts = contexts
    return this
  }

  private placeMarker(
    cur: string,
    val: unknown,
    index: number,
    length: number
  ) {
    let front = cur.trim()
    let res
    let partType: PartType = 'no'
    let isTail = index === length - 1
    if (/\s\w+\s*=\s*"\s*$/.test(front)) {
      throw TemplateSyntaxError
    }

    if (isTail) {
      return front
    }

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

    this.shallowParts.push(partType)
    return `${front}${res}`
  }
}

export class Clip {
  dof: DocumentFragment
  html: string
  shallowParts: PartType[]
  parts: Part[] = []
  initVals: unknown[]
  key: unknown
  contexts: Context<OBJ>[]
  uuid: number

  elementInstance?: UpdatableElement

  constructor(
    dof: DocumentFragment,
    html: string,
    shallowParts: PartType[],
    initVals: unknown[],
    key: unknown,
    contexts: Context<OBJ>[]
  ) {
    this.key = key
    this.dof = dof
    this.html = html
    this.initVals = initVals
    this.shallowParts = shallowParts
    this.attachPart()
    this.contexts = contexts

    this.uuid = Date.now()

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

      if (isElement(cur)) {
        const attr = cur.attributes
        const { length } = attr

        for (let i = 0; i < length; i++) {
          let name = attr[i].name
          let prefix = name[0]
          if (
            prefix === '.' ||
            (prefix === ':' && isMarker(attr[i].value)) ||
            prefix === '@'
          ) {
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
            this.initVals[count],
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
