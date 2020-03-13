import { shallowEqual, twoStrArrayCompare } from './utils'
import { Clip, ShallowClip } from './clip'
import { UpdatableElement } from './component'
import { NotUpdatableError } from './error'
import { generateEventOptions } from './event'
import { removeNodes } from './dom'

export type AttrPropLocation = { node: Element; name: string }
export type EventLocation = { node: Element; name: string }
export type TextLocation = { node: Comment | Text }
export type clipLocation = { startNode: Comment; endNode: Comment }

export type EventInstance = (this: Document, e: Event) => unknown

export type PartLocation =
  | AttrPropLocation
  | clipLocation
  | EventLocation
  | TextLocation
  | undefined

export type PartType =
  | 'attr'
  | 'prop'
  | 'clip'
  | 'text'
  | 'event'
  | 'clips'
  | 'no'

export abstract class Part {
  index: number
  value: unknown
  oldValue: unknown = null
  location: PartLocation

  setLocation(location: PartLocation) {
    this.location = location
  }

  constructor(index: number) {
    this.index = index
  }

  abstract init(): void
  abstract clear(): void
  abstract commit(): void

  setValue(val: unknown): void {
    if (!this.checkEqual(val)) {
      this.oldValue = this.value
      this.value = val
      this.commit()
    }
  }

  checkEqual(val: unknown) {
    return shallowEqual(val, this.oldValue)
  }
}

export class PorpPart extends Part {
  clear(): void {
    throw new Error('Method not implemented.')
  }
  location: AttrPropLocation
  value: string

  constructor(index: number, val: string, location: AttrPropLocation) {
    super(index)
    this.value = val
    this.location = location
  }

  init(): void {
    this.commit()
  }
  commit(): void {
    let { name, node } = this.location
    if (!(node instanceof UpdatableElement)) {
      throw NotUpdatableError
    } else {
      node.$props[name] = this.value
    }
  }
}

export class AttrPart extends Part {
  location: { node: Element; name: string }
  value: string
  styleCache?: string

  constructor(
    index: number,
    val: string,
    location: { node: Element; name: string }
  ) {
    super(index)
    this.value = val
    this.location = location
  }
  clear(): void {
    this.location.node.removeAttribute(this.location.name)
  }
  init(): void {
    let { name, node } = this.location
    if (name === 'style') {
      this.styleCache = node.getAttribute('style') ?? undefined
    }
    this.commit()
  }
  commit(): void {
    let { name, node } = this.location
    let res: string
    if (name === 'style') {
      res = `${this.styleCache ?? ''};${this.value}`
    } else {
      res = this.value
    }
    node.setAttribute(name, res)
  }
}

export class TextPart extends Part {
  commit(): void {
    let { node } = this.location
    node.parentNode?.replaceChild(new Text(this.value.toString()), node)
  }
  clear(): void {
    let { node } = this.location
    node.parentNode?.replaceChild(new Text(), node)
  }
  init(): void {
    this.commit()
  }
  location: TextLocation
  value: string | number

  constructor(index: number, val: string, location: TextLocation) {
    super(index)
    this.location = location
    this.value = val
  }
}

export class EventPart extends Part {
  commit(): void {
    let { node } = this.location
    if (this.value instanceof Array) {
      this.value.forEach(v => {
        let ev = this.tryGetFromCache(v)
        node.addEventListener(this.eventName, ev, this.options)
      })
    } else {
      node.addEventListener(
        this.eventName,
        this.tryGetFromCache(this.value),
        this.options
      )
    }
  }
  clear(): void {
    this.eventCache.forEach(val => {
      this.location.node.removeEventListener(this.eventName, val, this.options)
    })
    this.eventCache.clear()
  }
  init(): void {
    this.commit()
  }

  setValue(val: EventInstance | EventInstance[]) {
    let temp = []
    if (val instanceof Array) {
      temp = val.map(v => v.toString())
    } else {
      temp = [val.toString()]
    }
    if (twoStrArrayCompare(temp, Array.from(this.eventCache.keys()))) {
      return
    } else {
      this.clear()
      this.commit()
    }
  }

  tryGetFromCache(e: EventInstance) {
    return (
      this.eventCache.get(e.toString()) ??
      this.eventCache.set(e.toString(), e).get(e.toString())!
    )
  }

  location: EventLocation
  value: EventInstance | EventInstance[]
  eventCache: Map<string, EventInstance> = new Map()
  options: AddEventListenerOptions
  eventName: keyof DocumentEventMap

  constructor(
    index: number,
    val: EventInstance | EventInstance[],
    location: EventLocation
  ) {
    super(index)
    this.location = location
    const { name } = this.location
    const [eventName, ...opts] = name.split('.')
    this.options = generateEventOptions(new Set(opts))
    this.eventName = eventName as keyof DocumentEventMap
    this.value = val
  }
}

export class ClipPart extends Part {
  commit(): void {
    this.value.update(this.shaValue.vals)
  }
  clear(): void {
    let { startNode, endNode } = this.location
    removeNodes(startNode.parentNode!, startNode.nextSibling, endNode)
  }
  init(): void {
    let { startNode, endNode } = this.location
    let parent = startNode.parentNode!
    parent.insertBefore(this.value.dof, endNode)
    this.commit()
  }

  setValue(val: ShallowClip) {
    this.shaValue = val
    if (this.shaValue.shallowHtml === this.value.html) {
      this.commit()
    } else {
      this.value = this.shaValue.createInstance()
      this.clear()
      this.init()
    }
  }
  location: clipLocation
  value: Clip
  shaValue: ShallowClip

  constructor(index: number, val: ShallowClip, location: clipLocation) {
    super(index)
    this.location = location
    this.shaValue = val
    this.value = val.createInstance()
  }
}

export class ClipsPart extends Part {
  commit(): void {
    let { startNode, endNode } = this.location
    let parent = startNode.parentNode
    this.value.forEach(v => {
      parent?.insertBefore(v.dof, endNode)
    })
  }
  clear(): void {
    let { startNode, endNode } = this.location
    removeNodes(startNode.parentNode!, startNode.nextSibling, endNode)
  }
  init(): void {
    this.commit()
  }

  setValue(vals: ShallowClip[]) {
   
  }

  resetValue() {
    return this.shaValues.reduce((acc, cur) => {
      let clip = cur.createInstance()
      acc.push(clip)
      return acc
    }, new Array<Clip>())
  }

  location: clipLocation
  value: Clip[]
  shaValues: ShallowClip[]

  constructor(index: number, val: ShallowClip[], location: clipLocation) {
    super(index)
    this.location = location
    this.shaValues = val
    this.value = this.resetValue()
  }
}
