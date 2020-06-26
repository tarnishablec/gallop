import { isReactive, mergeProps, mergeProp } from './component'
import { NotReactiveELementError } from './error'
import { Obj } from './utils'
import { resolveDirective } from './directive'
import { generateEventOptions } from './dom'

export type AttrPartLocation = { node: Node; name: string }
export type NodePartLocation = { startNode: Node; endNode: Node }
export type PartLocation = AttrPartLocation | NodePartLocation

export interface Part {
  value: unknown
  location: PartLocation
  setValue(val: unknown): void
  clear(): void
}

export class NodePart implements Part {
  value: unknown

  constructor(public location: NodePartLocation, public index: number) {}

  setValue(val: unknown): void {
    throw new Error('Method not implemented.')
  }
  clear(): void {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart implements Part {
  value: unknown

  constructor(public location: AttrPartLocation, public index: number) {}

  setValue(val: unknown): void {
    throw new Error('Method not implemented.')
  }
  clear(): void {
    throw new Error('Method not implemented.')
  }
}

export class PropPart implements Part {
  value: unknown

  constructor(public location: AttrPartLocation, public index: number) {}

  setValue(val: unknown): void {
    if (resolveDirective(val, this)) return

    const { name, node } = this.location
    if (!isReactive(node)) {
      throw NotReactiveELementError(name)
    }

    if (name === '$props') {
      if (val instanceof Object) {
        mergeProps(node, val as Obj)
      } else {
        throw new SyntaxError(`$props prop need an object`)
      }
    } else {
      mergeProp(node, name, val)
    }

    this.value = val
  }
  clear(): void {
    throw new Error('Method not implemented.')
  }
}

type EventInstance = (e: Event) => void

export class EventPart implements Part {
  value: unknown
  options: AddEventListenerOptions
  eventName: string
  cache: Map<string, EventInstance> = new Map()
  constructor(public location: AttrPartLocation, public index: number) {
    const { name } = location
    const [eventName, ...opts] = name.split('.')
    this.options = generateEventOptions(new Set(opts))
    this.eventName = eventName
  }

  setValue(val: EventInstance | EventInstance[]): void {
    if (resolveDirective(val, this)) return

    if (!Array.isArray(val)) val = [val]

    if (val.join('') !== Array.from(this.cache.keys()).join('')) {
      this.clear()
      const { node } = this.location
      val.forEach((e) => {
        node.addEventListener(this.eventName, e, this.options)
        this.cache.set(e.toString(), e)
      })
    }
  }
  clear(): void {
    this.cache.forEach((e) => {
      this.location.node.removeEventListener(this.eventName, e, this.options)
    })
    this.cache.clear()
  }
}
