import { ShallowClip, Clip, createInstance, getVals, getShaHtml } from './clip'
import { UpdatableElement } from './component'
import { shallowEqual, twoStrArrayCompare, tryParseToString } from './utils'
import { generateEventOptions } from './event'
import { removeNodes } from './dom'

type AttrEventLocation = { node: Element; name: string }
type PropLocation = { node: UpdatableElement; name: string }
type NodeLocation = { startNode: Comment; endNode: Comment }

type PartLocation = AttrEventLocation | PropLocation | NodeLocation
type NodePartType = 'clip' | 'clips' | 'text'
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
      // console.log(`nothing changed`)
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
    this.shaHtmlCache = undefined
    const { startNode, endNode } = this.location
    const parent = startNode.parentNode!
    removeNodes(parent, startNode.nextSibling, endNode)
  }

  commit(): void {}

  commitText(type: 'text', val: string) {
    this.clear()
    this.location.startNode.parentNode!.insertBefore(
      new Text(val?.toString()),
      this.location.endNode
    )
    this.value = val
  }

  commitClip(type: 'clip', val: ShallowClip) {
    if (type === this.type) {
      const shaHtml = val.do(getShaHtml)
      if (shaHtml === this.shaHtmlCache) {
        const nowClip = this.value as Clip
        nowClip.tryUpdate(val.do(getVals))
        return
      } else {
        this.shaHtmlCache = shaHtml
      }
    }
    const { startNode, endNode } = this.location
    const parent = startNode.parentNode!
    this.clear()
    const clip = val.do(createInstance)
    clip.tryUpdate(val.do(getVals))
    parent.insertBefore(clip.dof, endNode)
    this.value = clip
  }

  commmitClips(type: 'clips', val: unknown[]) {
    //TODO key diff ?
    this.clear()
    const batch = new DocumentFragment()
    let res = new Array<Clip | string>()
    val.forEach((v) => {
      if (v instanceof ShallowClip) {
        const clip = v.do(createInstance)
        clip.tryUpdate(v.do(getVals))
        batch.append(clip.dof)
        res.push(clip)
      } else {
        const str = tryParseToString(v)
        batch.append(str)
        res.push(str)
      }
    })
    this.location.startNode.parentNode!.insertBefore(
      batch,
      this.location.endNode
    )
    this.value = res
  }

  setValue(val: unknown) {
    let type: NodePartType
    if (val instanceof ShallowClip) {
      type = 'clip'
      this.commitClip(type, val)
    } else if (Array.isArray(val)) {
      type = 'clips'
      this.commmitClips(type, val)
    } else {
      type = 'text'
      val !== this.value && this.commitText(type, tryParseToString(val))
    }
    this.type = type
  }

  value!: (Clip | string)[] | string | Clip
  location!: NodeLocation
  shaHtmlCache?: string
  keyCache?: unknown[]
}

export class AttrPart extends Part {
  clear(): void {}
  commit(): void {
    const { node, name } = this.location
    let res: string
    let val = this.value ?? ''
    if (name === 'style') {
      res = `${this.styleCache ?? ''}${this.styleCache ? ';' : ''}${val}`
    } else {
      res = val
    }
    if (name === 'class') {
      let classes = this.value.split(' ').filter(Boolean)
      if (!twoStrArrayCompare(classes, this.classCache ?? [])) {
        node.classList.remove(...(this.classCache ?? []))
        node.classList.add(...classes)
        this.classCache = classes
      }
      return
    }
    if (name === 'value') {
      if (Reflect.get(node, 'value')) {
        Reflect.set(node, 'value', this.value)
      }
      return
    }
    node.setAttribute(name, res)
  }

  constructor(index: number, location: AttrEventLocation) {
    super(index, location, 'attr')
    const { node } = this.location
    const staticStyle = node.getAttribute('style')
    if (staticStyle) {
      this.styleCache = staticStyle
    }
  }

  value!: string
  location!: AttrEventLocation
  styleCache?: string
  classCache?: string[]
}

type EventInstance = (e: Event) => unknown

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
    this.value.forEach((v) => {
      let ev = this.tryGetFromCache(v)
      node.addEventListener(this.eventName, ev, this.options)
    })
  }

  setValue(val: EventInstance | EventInstance[]) {
    let temp: string[]
    if (Array.isArray(val)) {
      temp = val.map((v) => v?.toString())
    } else {
      temp = [val.toString()]
    }
    if (!twoStrArrayCompare(temp, Array.from(this.eventCache.keys()))) {
      this.value = Array.isArray(val) ? val : [val]
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

  value!: EventInstance[]
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
