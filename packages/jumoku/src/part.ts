import { shallowEqual, twoStrArrayCompare, dedup, keyListDiff } from './utils'
import { Clip, ShallowClip } from './clip'
import { UpdatableElement } from './component'
import { NotUpdatableError } from './error'
import { generateEventOptions } from './event'
import { removeNodes, insertAfter, getNodesBetween } from './dom'

export type AttrEventLocation = { node: Element; name: string }
export type PropLocation = { node: UpdatableElement; name: string }
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
    let { node } = this.location
    if (!(node instanceof UpdatableElement)) {
      throw NotUpdatableError
    }
    this.update()
  }

  setValue(val: unknown) {
    this.value = val
  }

  update(): void {
    let { name, node } = this.location
    node.mergeProps(name, this.value)
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
    let next = new Text(this.value?.toString())
    node.parentNode?.replaceChild(next, node)
    this.location.node = next
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
    this.value.init()
    parent.insertBefore(this.value.dof, endNode)
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
    let { startNode, endNode } = this.location
    let parent = startNode.parentNode!
    let nodeCache = getNodesBetween(startNode, endNode)

    let diffRes = keyListDiff(this.keys, this.newKeys)

    let after: Node
    diffRes.forEach(d => {
      switch (d.type) {
        case 'insert':
          {
            let clip = this.shaValues[d.newIndex].createInstance()
            clip.init()
            let dof = clip.dof
            let last = dof.lastChild ?? dof

            if (!d.after) {
              parent.insertBefore(dof, nodeCache[0])
            } else {
              insertAfter(parent, dof, after)
            }
            after = last
          }
          break
        case 'remove':
          parent.removeChild(nodeCache[d.oldIndex])
          break
        case 'move':
          {
          }
          break

        default:
          break
      }
    })
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

    let doc = document.createDocumentFragment()
    this.value.forEach(v => {
      doc.appendChild(v.dof)
    })
    parent?.insertBefore(doc, endNode)
  }

  setValue(vals: ShallowClip[]) {
    this.shaValues = vals
    this.newKeys = vals.map(v => v.key)
    let temp = dedup(this.newKeys)

    if (temp?.[0] !== null) {
      // if (temp.length !== this.newKeys.length) {
      //   throw DuplicatedKeyError
      // } else {
      //   this.update()
      // }

      //TODO

      this.clear()
      this.resetValue()
      this.init()
    } else {
      this.clear()
      this.resetValue()
      this.init()
    }

    this.keys = this.newKeys
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

  constructor(index: number, val: ShallowClip[], location: clipLocation) {
    super(index)
    this.location = location
    this.shaValues = val
    this.resetValue()
  }
}
