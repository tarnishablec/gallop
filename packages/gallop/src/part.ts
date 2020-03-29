import { ShallowClip, createInstance, getVals, getShaHtml, Clip } from './clip'
import { UpdatableElement } from './component'
import { shallowEqual, twoStrArrayCompare } from './utils'
import { generateEventOptions } from './event'
import { removeNodes } from './dom'

type AttrEventLocation = { node: Element; name: string }
type PropLocation = { node: UpdatableElement; name: string }
type NodeLocation = { startNode: Comment; endNode: Comment }

type PartLocation = AttrEventLocation | PropLocation | NodeLocation
type NodePartType = 'clip' | 'clips' | 'text' | 'no'
type PartType = 'node' | 'attr' | 'event' | 'prop' | NodePartType

const initValue = Symbol('')

export abstract class Part {
  index: number
  value: unknown = initValue
  location: PartLocation
  type: PartType

  constructor(index: number, location: PartLocation, type: PartType) {
    this.index = index
    this.location = location
    this.type = type
  }

  setValue(val: unknown) {
    if (shallowEqual(this.value, val)) {
      console.log(`nothing changed`)
      return
    } else {
      this.value = val
      this.commit()
    }
  }
  abstract commit(): unknown
  abstract clear(): void
}

export class NodePart extends Part {
  clear(): void {
    const { startNode, endNode } = this.location
    const parent = startNode.parentNode!
    removeNodes(parent, startNode.nextSibling, endNode)
  }

  commit(): void {
    if (this.type === 'text') {
      this.commitText()
    } else if (this.type === 'clip') {
      this.commitClip()
    } else if (this.type === 'clips') {
      this.commmitClips()
    } else {
      this.commitOther()
    }
  }

  commitText() {}

  commitClip() {}

  commmitClips() {}

  commitOther() {}

  resetClip() {}

  setValue(val: string | ShallowClip | any[] | null) {}

  value!: string | Clip | any[] | null
  location!: NodeLocation
  typeChanged: boolean = true
  shaHtmlCache?: string
}

export class AttrPart extends Part {
  clear(): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    const { node, name } = this.location
    let res: string
    let val = this.value ?? ''
    if (name === 'style') {
      res = `${this.styleCache ?? ''}${this.styleCache ? ';' : ''}${val}`
    } else {
      res = val
    }
    node.setAttribute(name, res)
  }

  constructor(index: number, location: AttrEventLocation) {
    super(index, location, 'attr')
    const staticStyle = this.location.node.getAttribute('style')
    if (staticStyle) {
      this.styleCache = staticStyle
    }
  }

  value!: string
  location!: AttrEventLocation
  styleCache?: string
}

type EventInstance = (this: Document, e: Event) => unknown

export class EventPart extends Part {
  clear(): void {
    this.eventCache.forEach((val) => {
      this.location.node.removeEventListener(this.eventName, val, this.options)
    })
    this.eventCache.clear()
  }

  commit(): void {
    this.clear()
    const { node } = this.location
    if (this.value instanceof Array) {
      this.value.forEach((v) => {
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

  setValue(val: EventInstance | EventInstance[]) {
    let temp: string[]
    if (val instanceof Array) {
      temp = val.map((v) => v.toString())
    } else {
      temp = [val.toString()]
    }
    if (!twoStrArrayCompare(temp, Array.from(this.eventCache.keys()))) {
      this.value = val
      this.commit()
    }
  }

  tryGetFromCache(e: EventInstance) {
    return (
      this.eventCache.get(e.toString()) ??
      this.eventCache.set(e.toString(), e).get(e.toString())!
    )
  }

  constructor(index: number, location: AttrEventLocation) {
    super(index, location, 'event')
    const { name } = this.location
    const [eventName, ...opts] = name.split('.')
    this.options = generateEventOptions(new Set(opts))
    this.eventName = eventName as keyof DocumentEventMap
  }

  value!: EventInstance | EventInstance[]
  location!: AttrEventLocation
  eventName: keyof DocumentEventMap
  eventCache: Map<string, EventInstance> = new Map()
  options: AddEventListenerOptions
}

export class PropPart extends Part {
  clear(): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    const { name, node } = this.location
    node.mergeProps(name, this.value)
  }

  constructor(index: number, location: PropLocation) {
    super(index, location, 'prop')
  }

  location!: PropLocation
}
