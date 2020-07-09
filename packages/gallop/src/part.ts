import { isReactive, mergeProps, mergeProp } from './component'
import { NotReactiveElementError } from './error'
import { tryParseToString, hashify } from './utils'
import { resolveDirective } from './directive'
import { generateEventOptions, removeNodes } from './dom'
import { Patcher } from './patcher'
import { HTMLClip, getShaHtml, getVals, createPatcher } from './clip'

export type AttrPartLocation = { node: Element; name: string }
export type NodePartLocation = { startNode: Comment; endNode: Comment }
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
    if (resolveDirective(val, this)) return

    const [result, init] = tryUpdateEntry(this.value, val)
    if (init === 2) {
      const { endNode } = this.location
      const parent = endNode.parentNode!
      this.clear()
      if (result instanceof Patcher) parent.insertBefore(result.dof, endNode)
      else parent.insertBefore(new Text(tryParseToString(result)), endNode)
    }

    this.value = result
  }
  clear(): void {
    const { startNode, endNode } = this.location
    removeNodes(startNode, endNode)
  }
}

export class AttrPart implements Part {
  value: unknown
  cache: { style?: string; classes?: string[] }

  constructor(public location: AttrPartLocation, public index: number) {
    const style = location.node.getAttribute('style') ?? undefined
    this.cache = { style }
  }

  setValue(val: unknown): void {
    if (resolveDirective(val, this)) return
    if (this.value === val) return
    const { node, name } = this.location
    if (name === 'value') {
      Reflect.set(node, name, val)
      this.value = val
      return
    }
    let temp = tryParseToString(val)
    if (name === 'class') {
      const { classes } = this.cache
      const cs = temp.split(' ').filter(Boolean)
      if (cs.join('') !== classes?.join('')) {
        node.classList.remove(...(classes ?? []))
        node.classList.add(...cs)
        this.cache.classes = cs
      }
      this.value = cs
      return
    }

    if (name === 'style') {
      const { style } = this.cache
      temp = `${style ?? ''}${style ? ';' : ''}${temp}`
    }
    node.setAttribute(name, temp)
    this.value = temp
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
    if (!isReactive(node)) throw NotReactiveElementError(name)
    if (name === '$props') {
      mergeProps(node, val)
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
    const [eventName, ...opts] = location.name.split('.')
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

//
function initEntry(val: unknown): unknown {
  if (Array.isArray(val)) throw new SyntaxError(`use repeat() directive`)
  if (val instanceof HTMLClip) return val.do(createPatcher).patch(val.do(getVals))
  return val
}

/**
 * @returns 0 -> no change
 * @returns 1 -> update part
 * @returns 2 -> clean and init part
 */
function tryUpdateEntry(pre: unknown, val: unknown): [unknown, 0 | 1 | 2] {
  if (Object.is(pre, val)) return [pre, 0]
  if (
    pre instanceof Patcher &&
    val instanceof HTMLClip &&
    pre.hash === hashify(val.do(getShaHtml))
  )
    return [pre.patch(val.do(getVals)), 1]
  return [initEntry(val), 2]
}
