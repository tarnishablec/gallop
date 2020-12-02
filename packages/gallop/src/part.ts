import { isReactive, mergeProps, mergeProp } from './component'
import { NotReactiveElementError } from './error'
import { tryParseToString, hashify, isObject, Obj } from './utils'
import { resolveDirective } from './directive'
import { generateEventOptions, removeNodes } from './dom'
import { Patcher } from './patcher'
import { HTMLClip, getShaHtml, getVals } from './clip'

export type AttrPartLocation = { node: Element; name: string }
export type NodePartLocation = { startNode: Comment; endNode: Comment }
export type PartLocation = AttrPartLocation | NodePartLocation

export interface Part<T = unknown> {
  value?: T
  location: PartLocation
  setValue(val: unknown): unknown
  clear(): unknown
}

export class NodePart implements Part {
  value: unknown
  contextNode?: Node | null

  constructor(public location: NodePartLocation) {
    const parent = location.startNode.parentNode
    this.contextNode = parent
  }

  static create(marker?: string) {
    const dof = new DocumentFragment()
    const startNode = new Comment(marker)
    const endNode = new Comment(marker)
    dof.append(startNode, endNode)
    return new NodePart({ startNode, endNode })
  }

  setValue(val: HTMLClip): Patcher
  setValue(val: unknown): unknown
  setValue(val: unknown) {
    if (resolveDirective(val, this)) return

    if (val === void 0 || val === null) {
      this.clear()
      this.value = val
      return
    }

    const [result, init] = tryUpdateEntry(this.value, val, this.contextNode)
    if (init === 2) {
      const { endNode } = this.location
      const parent = endNode.parentNode!
      this.clear()
      if (result instanceof Patcher) {
        result.appendTo(parent, endNode)
      } else {
        parent.insertBefore(new Text(tryParseToString(val)), endNode)
      }
    }

    this.value = result
    return this.value
  }
  clear() {
    const { startNode, endNode } = this.location
    return removeNodes(startNode, endNode)
  }

  destroy() {
    const { startNode, endNode } = this.location
    return removeNodes(startNode, endNode, true)
  }

  moveInto(container: Node, before?: Node | null) {
    container.insertBefore(this.destroy(), before ?? null)
    this.contextNode = container
  }
}

export class AttrPart implements Part {
  value: unknown
  cache: { style?: string; classes?: string[] }

  constructor(public location: AttrPartLocation) {
    const style = location.node.getAttribute('style') ?? undefined
    this.cache = { style }
  }

  setValue(val: unknown): void {
    if (resolveDirective(val, this)) return
    if (this.value === val) return
    const { node, name } = this.location

    // $attrs batch binding?

    if (
      (name === 'checked' &&
        node instanceof HTMLInputElement &&
        ['checkbox', 'radio'].includes(node.type)) ||
      name === 'value'
    ) {
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

export class BoolPart implements Part<boolean> {
  value: boolean = false
  constructor(public location: AttrPartLocation) {}

  setValue(val: unknown): unknown {
    if (resolveDirective(val, this)) return
    const v = !!val
    const { name, node } = this.location
    this.value !== v ? node.toggleAttribute(name) : null
    this.value = v
  }
  clear(): unknown {
    throw new Error('Method not implemented.')
  }
}

export class PropPart implements Part {
  value: unknown

  constructor(public location: AttrPartLocation) {}

  setValue(val: unknown): void {
    if (resolveDirective(val, this)) return

    const { name, node } = this.location
    if (!isReactive(node)) throw NotReactiveElementError(name)
    if (name === '$props') {
      if (isObject<Obj>(val)) mergeProps(node, val)
      else throw new SyntaxError(`$props must bind a {key:value} object`)
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

export class EventPart implements Part<EventInstance[]> {
  value?: EventInstance[]
  options: AddEventListenerOptions
  eventName: string
  cache: EventInstance[] = []
  constructor(public location: AttrPartLocation) {
    const [eventName, ...opts] = location.name.split('.')
    this.options = generateEventOptions(new Set(opts))
    this.eventName = eventName
  }

  setValue(val: EventInstance | EventInstance[]): void {
    if (resolveDirective(val, this)) return

    let temp: EventInstance[]
    if (Array.isArray(val)) temp = val
    else temp = [val]
    const { node } = this.location
    const { cache, eventName, options } = this
    const len = Math.max(temp.length, cache.length)
    for (let i = 0; i < len; i++) {
      const v = temp[i]
      const old = cache[i]
      if (!Object.is(old, v)) {
        old && node.removeEventListener(eventName, old, options)
        v && node.addEventListener(eventName, v, options)
        cache[i] = v
      }
    }
    this.value = temp
  }
  clear(): void {
    this.cache.forEach((e) =>
      this.location.node.removeEventListener(this.eventName, e, this.options)
    )
    this.cache.length = 0
  }
}

//
export function initEntry(val: unknown, contextNode?: Node | null): unknown {
  if (Array.isArray(val)) throw new SyntaxError(`use repeat() directive`)
  if (val instanceof HTMLClip)
    return val.createPatcher(contextNode).patch(val.do(getVals))
  return val
}

/**
 * @returns 0 -> no change
 * @returns 1 -> update part
 * @returns 2 -> clean and init part
 */
export function tryUpdateEntry(
  pre: unknown,
  val: unknown,
  contextNode?: Node | null
): [unknown, 0 | 1 | 2] {
  if (Object.is(pre, val)) return [pre, 0]
  if (
    pre instanceof Patcher &&
    val instanceof HTMLClip &&
    pre.hash === hashify(val.do(getShaHtml))
  )
    return [pre.patch(val.do(getVals)), 1]
  return [initEntry(val, contextNode), 2]
}
