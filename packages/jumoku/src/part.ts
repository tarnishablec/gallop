import { ShallowClip, Clip } from './clip'
import { generateEventOptions } from './event'
import { removeNodes } from './dom'
import { UpdatableElement } from './component'
import { shallowEqual } from './utils'

type PartLocation =
  | { node: Node; name: string }
  | { startNode: Comment; endNode: Comment }
  | { textNodePre: Comment | Text }

type PartType = 'attr' | 'prop' | 'clip' | 'text' | 'event' | 'clips' | 'no'

export abstract class Part {
  index: number
  value: unknown
  oldValue: unknown = null
  protected location!: PartLocation

  setLocation(location: PartLocation) {
    this.location = location
  }

  constructor(index: number) {
    this.index = index
  }

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

  abstract commit(): void
}

export class ShallowPart extends Part {
  type: PartType = 'no'

  constructor(index: number) {
    super(index)
  }

  setType(type: PartType) {
    this.type = type
  }

  makeReal(): Part {
    switch (this.type) {
      case 'prop':
        return new PorpPart(this.index)
      case 'attr':
        return new AttrPart(this.index)
      case 'clip':
        return new ClipPart(this.index)
      case 'text':
        return new TextPart(this.index)
      case 'event':
        return new EventPart(this.index)
      case 'clips':
        return new ClipsPart(this.index)
      default:
        return this
    }
  }

  commit(): void {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart extends Part {
  value!: string
  location!: { node: Element; name: string }

  commit(): void {
    let { node, name } = this.location
    if (name === 'style') {
      let style = node.getAttribute('style')
      node.setAttribute(name, style ? `${style};${this.value}` : this.value)
    } else {
      node.setAttribute(name, this.value)
    }
  }
}

export class PorpPart<P extends object, K extends keyof P> extends Part {
  value!: P[K]
  location!: { node: UpdatableElement<P>; name: keyof P }

  commit(): void {
    let { node, name } = this.location
    ;(node.$props as P)[name] = this.value
  }
}

export class TextPart extends Part {
  value!: string | number | undefined | null
  location!: { textNodePre: Comment | Text }

  commit(): void {
    let pre = this.location.textNodePre
    let next = new Text(this.value?.toString())
    this.location.textNodePre = next
    pre.parentNode?.replaceChild(next, pre)
  }
}

export class EventPart extends Part {
  value!: (e?: Event) => unknown
  location!: { node: Element; name: keyof DocumentEventMap }

  checkEqual(val: unknown) {
    if (!(val instanceof Function)) {
      throw new Error('should be a function')
    } else {
      return val.toString() === this.value?.toString()
    }
  }

  commit(): void {
    let { node, name } = this.location
    let [eventName, ...opts] = name.split('.')
    let option = generateEventOptions(new Set(opts))
    node.addEventListener(eventName, this.value, option)
  }
}

export class ClipPart extends Part {
  value!: ShallowClip
  location!: { startNode: Comment; endNode: Comment }

  init() {
    this.clear()

    let clip = this.value.createInstance()
    clip.update(this.value.vals)
    this.location.startNode.parentNode?.insertBefore(
      clip.dof,
      this.location.endNode
    )
  }

  commit() {
    this.init()
  }

  clear(startNode: Node = this.location.startNode) {
    removeNodes(
      this.location.startNode.parentNode!,
      startNode,
      this.location.endNode
    )
  }
}

export class ClipsPart extends Part {
  value!: ShallowClip[]
  location!: { startNode: Comment; endNode: Comment }

  init() {
    this.clear()

    let clips = new Array<Clip>()

    this.value.forEach(c => clips.push(c.createInstance()))
    clips.forEach((c, index) => {
      c.update(this.value[index].vals)
      this.location.startNode.parentNode?.insertBefore(
        c.dof,
        this.location.endNode
      )
    })
  }

  commit() {
    this.init()
  }

  clear(startNode: Node = this.location.startNode) {
    removeNodes(
      this.location.startNode.parentNode!,
      startNode,
      this.location.endNode
    )
  }
}
