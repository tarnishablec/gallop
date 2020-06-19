import { Clip, HTMLClip, createClip, getVals, getShaHtml } from './clip'
import { ReactiveElement } from './component'
import { VirtualElement } from './virtual'
import { shallowEqual, twoStrArrayCompare, tryParseToString } from './utils'
import { generateEventOptions } from './event'
import { removeNodes } from './dom'
import { resolveDirective } from './directive'
import { DirectivePartTypeError } from './error'

type AttrEventLocation = { node: Element; name: string }
type PropLocation = { node: ReactiveElement; name: string }
type NodeLocation = { startNode: Comment; endNode: Comment }

type PartLocation = AttrEventLocation | PropLocation | NodeLocation
type NodePartType = 'clip' | 'clips' | 'text' | 'element'
type PartType = 'node' | 'attr' | 'event' | 'prop' | NodePartType

export type NodeValueType = Clip | string | ReactiveElement | NodeValueType[]

export const initValue = Symbol('')

export abstract class Part {
  index: number
  protected value: unknown
  // pendingValue: unknown
  location: PartLocation
  type: PartType
  destroyedCallbacks?: (() => void)[]

  constructor(index: number, location: PartLocation, type: PartType) {
    this.index = index
    this.location = location
    this.type = type
  }

  setValue(val: unknown) {
    const over = resolveDirective(val, this)
    if (over) {
      return
    }

    if (shallowEqual(this.value, val)) {
      // console.log(`nothing changed`)
      return
    } else {
      this.value = val
      this.commit()
    }
  }
  protected abstract commit(): unknown
  abstract clear(): void
  destroy() {
    this.destroyedCallbacks?.forEach((cb) => cb())
  }
}

export class NodePart extends Part {
  clear(): void {
    const { startNode, endNode } = this.location
    const parent = startNode.parentNode!
    removeNodes(parent, startNode.nextSibling, endNode)
  }

  protected commit(): void {}

  setValue(val: unknown) {
    const over = resolveDirective(val, this)
    if (over) {
      return
    }
    // debugger
    const [newVal, isInit] = tryUpdateEntry(this.value, val)
    this.value = newVal
    if (isInit) {
      this.clear()
      const dof = extractDof(newVal)
      const { endNode } = this.location
      const parent = endNode.parentNode!
      parent.insertBefore(dof, endNode)
    }
    return this.value
  }

  protected value!: NodeValueType
  location!: NodeLocation
}

export class AttrPart extends Part {
  clear(): void {}
  commit(): void {
    const { node, name } = this.location
    let res: string
    const val = this.value ?? ''
    if (name === 'style') {
      res = `${this.styleCache ?? ''}${this.styleCache ? ';' : ''}${val}`
    } else {
      res = val
    }
    if (name === 'class') {
      const classes = this.value.split(' ').filter(Boolean)
      if (!twoStrArrayCompare(classes, this.classCache ?? [])) {
        node.classList.remove(...(this.classCache ?? []))
        node.classList.add(...classes)
        this.classCache = classes
      }
      return
    }
    if (name === 'value') {
      Reflect.set(node, 'value', this.value)
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

  protected value!: string
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

  protected commit(): void {
    this.clear()
    const { node } = this.location
    this.value.forEach((v) => {
      const ev = this.tryGetFromCache(v)
      node.addEventListener(this.eventName, ev, this.options)
    })
  }

  setValue(val: EventInstance | EventInstance[]) {
    const over = resolveDirective(val, this)
    if (over) {
      return
    }

    const pv = val

    if (!(pv instanceof Function)) {
      throw DirectivePartTypeError(this.type)
    }

    let temp: string[]
    if (Array.isArray(pv)) {
      temp = pv.map((v) => v?.toString())
    } else {
      temp = [pv.toString()]
    }
    if (!twoStrArrayCompare(temp, Array.from(this.eventCache.keys()))) {
      this.value = (Array.isArray(pv) ? pv : [pv]) as EventInstance[]
      this.commit()
    }
  }

  tryGetFromCache(e: EventInstance) {
    // unsafe
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
  protected commit(): void {
    const { name, node } = this.location
    if (name !== '$props') {
      node.mergeProp(name, this.value)
    } else {
      node.mergeProps(this.value as object)
    }
  }

  constructor(index: number, location: PropLocation) {
    super(index, location, 'prop')
  }

  location!: PropLocation
}

////////////////

export function initEntry(val: VirtualElement): ReactiveElement
export function initEntry(val: HTMLClip): Clip
export function initEntry(val: unknown[]): NodeValueType[]
export function initEntry(val: unknown): NodeValueType
export function initEntry(val: unknown): NodeValueType {
  if (Array.isArray(val)) {
    const res: NodeValueType[] = []
    val.forEach((v) => {
      res.push(initEntry(v))
    })
    return res
  } else if (val instanceof HTMLClip) {
    const clip = val.do(createClip)
    clip.tryUpdate(val.do(getVals))
    return clip
  } else if (val instanceof VirtualElement) {
    // debugger
    return val.createInstance()
  } else {
    return tryParseToString(val)
  }
}

export function tryUpdateEntry(
  pre: NodeValueType,
  val: unknown
): [NodeValueType, boolean] {
  if (pre instanceof Clip && val instanceof HTMLClip) {
    if (val.do(getShaHtml) === pre.shaHtml) {
      return [pre.tryUpdate(val.do(getVals)), false]
    }
  } else if (pre instanceof ReactiveElement && val instanceof VirtualElement) {
    if (pre.localName === val.tag) {
      val.slotContent &&
        pre.$virtualSlotClip?.tryUpdate(val.slotContent?.do(getVals))
      return [pre.mergeProps(val.props ?? {}), false]
    }
  } else if (Array.isArray(val)) {
    return [initEntry(val), true]
  } else if (
    typeof pre === 'string' &&
    !(val instanceof VirtualElement || val instanceof HTMLClip)
  ) {
    const str = tryParseToString(val)
    if (pre === str) {
      return [pre, false]
    } else {
      return [str, true]
    }
  }
  return [initEntry(val), true]
}

export function extractDof(val: NodeValueType) {
  const dof = new DocumentFragment()
  if (Array.isArray(val)) {
    val.forEach((v) => {
      dof.append(extractDof(v))
    })
  } else if (val instanceof ReactiveElement) {
    dof.append(val)
  } else if (val instanceof Clip) {
    dof.append(val.dof)
  } else {
    dof.append(val)
  }
  return dof
}
