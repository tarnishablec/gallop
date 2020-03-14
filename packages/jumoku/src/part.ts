import {
  shallowEqual,
  twoStrArrayCompare,
  keyListDiff,
  dedup,
  moveInArray
} from './utils'
import { Clip, ShallowClip } from './clip'
import { UpdatableElement } from './component'
import { NotUpdatableError, DuplicatedKeyError } from './error'
import { generateEventOptions } from './event'
import { removeNodes, insertAfter, getNodesBetween } from './dom'
import { isEmptyArray } from './is'

export type AttrEventLocation = { node: Element; name: string }
export type PropLocation = { node: UpdatableElement<any>; name: string }
export type TextLocation = { node: Comment | Text }
export type clipLocation = { startNode: Comment; endNode: Comment }

export type EventInstance = (this: Document, e: Event) => unknown

export type PartLocation =
  | AttrEventLocation
  | PropLocation
  | clipLocation
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
  location: PartLocation

  setLocation(location: PartLocation) {
    this.location = location
  }

  constructor(index: number) {
    this.index = index
  }

  abstract init(): void
  abstract clear(): void
  abstract update(): void

  setValue(val: unknown): void {
    if (!this.checkEqual(val)) {
      this.value = val
      this.update()
    }
  }

  checkEqual(val: unknown) {
    return shallowEqual(val, this.value)
  }
}

export class PorpPart extends Part {
  location: PropLocation
  value: unknown

  constructor(index: number, val: unknown, location: PropLocation) {
    super(index)
    this.value = val
    this.location = location
  }

  clear(): void {}

  init(): void {
    let { name, node } = this.location
    if (!(node instanceof UpdatableElement)) {
      throw NotUpdatableError
    } else {
      node.$props[name] = this.value
    }
  }

  setValue(val: unknown) {
    let { name, node } = this.location
    node = node as UpdatableElement<any>
    this.value = val
    if (!shallowEqual(node.$props[name], this.value)) {
      this.update()
    }
  }

  update(): void {
    this.location.node.$props[this.location.name] = this.value
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
    this.update()
  }
  update(): void {
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
  update(): void {
    let { node } = this.location
    let next = new Text(this.value.toString())
    this.location.node = next
    node.parentNode?.replaceChild(next, node)
  }
  clear(): void {
    let { node } = this.location
    node.parentNode?.replaceChild(new Text(), node)
  }
  init(): void {
    this.update()
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
  update(): void {
    this.clear()

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
    this.update()
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
      this.update()
    }
  }

  tryGetFromCache(e: EventInstance) {
    return (
      this.eventCache.get(e.toString()) ??
      this.eventCache.set(e.toString(), e).get(e.toString())!
    )
  }

  location: AttrEventLocation
  value: EventInstance | EventInstance[]
  eventCache: Map<string, EventInstance> = new Map()
  options: AddEventListenerOptions
  eventName: keyof DocumentEventMap

  constructor(
    index: number,
    val: EventInstance | EventInstance[],
    location: AttrEventLocation
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
  update(): void {
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
    this.value.init()
  }

  setValue(val: ShallowClip) {
    this.shaValue = val
    if (this.shaValue.shallowHtml === this.value.html) {
      this.update()
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
  update(): void {
    let oldKeys = this.keys
    let { add, remove, move } = keyListDiff(oldKeys, this.newKeys)
    if (isEmptyArray(add) && isEmptyArray(remove) && isEmptyArray(move)) {
      // console.log(`nothing to change`)
    } else {
      let parent = this.location.startNode.parentNode!
      let { startNode, endNode } = this.location

      let r = 0
      remove.forEach(index => {
        parent.removeChild(this.elementCache[index])
        this.elementCache = getNodesBetween(startNode, endNode)
        this.value.splice(index + r, 1)
        r--
      })
      add.forEach(index => {
        let clip = this.shaValues[index].createInstance()
        clip.init()

        this.elementCache[index]
          ? parent.insertBefore(clip.dof, this.elementCache[index])
          : parent.insertBefore(clip.dof, endNode)
        this.elementCache = getNodesBetween(startNode, endNode)
        this.value.splice(index, 0, clip)
      })
      move.forEach(({ from, to }) => {
        if (this.newKeys[to] === this.value[to].key) {
          //do nothing
        } else {
          let m = parent.removeChild(this.elementCache[from])
          insertAfter(parent, m, parent.childNodes[to])
          moveInArray(this.value, from, to)
        }
      })
      this.keys = this.value.map(v => v.key)
      // console.log(this.keys)
    }
  }
  clear(): void {
    let { startNode, endNode } = this.location
    removeNodes(startNode.parentNode!, startNode.nextSibling, endNode)
  }

  init(): void {
    this.value.forEach(v => v.init())
    let { startNode, endNode } = this.location
    let parent = startNode.parentNode

    this.keys = this.value.map(v => v.key)

    this.value.forEach(v => {
      parent?.insertBefore(v.dof, endNode)
    })

    this.elementCache = getNodesBetween(startNode, endNode)
  }

  setValue(vals: ShallowClip[]) {
    this.shaValues = vals
    this.newKeys = vals.map(v => v.key)
    let temp = dedup(this.newKeys)

    if (temp?.[0] !== null) {
      if (temp.length !== this.newKeys.length) {
        throw DuplicatedKeyError
      } else {
        this.update()
      }
    } else {
      this.clear()
      this.resetValue()
      this.init()
    }
  }

  resetValue() {
    this.value = []
    this.shaValues.forEach(s => {
      let clip = s.createInstance()
      this.value.push(clip)
    })
    this.value.forEach((v, index) => {
      v.update(this.shaValues[index].vals)
    })
  }

  location: clipLocation
  value: Clip[] = []
  shaValues: ShallowClip[]
  keys: unknown[] = []
  newKeys: unknown[] = []
  elementCache: Node[] = []

  constructor(index: number, val: ShallowClip[], location: clipLocation) {
    super(index)
    this.location = location
    this.shaValues = val
    this.resetValue()
  }
}
