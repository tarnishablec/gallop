import { UpdatableElement } from './updatableElement'
import { ShallowClip } from './clip'
import { generateEventOptions } from './event'
import { Proxyed } from './reactive'

type PartLocation =
  | { node: Node; name: string }
  | { startNode: Comment; endNode: Comment }
  | { textNodePre: Comment | Text }

type PartType = 'attr' | 'prop' | 'clip' | 'text' | 'event' | 'clips' | 'no'

export abstract class Part {
  index: number
  value: unknown
  protected location!: PartLocation

  setLocation(location: PartLocation) {
    this.location = location
  }

  constructor(index: number) {
    this.index = index
  }

  setValue(val: unknown): void {
    this.value = val
  }

  equals(val: unknown) {
    return this.value === val
  }

  abstract commit(): void
}

export class ShallowPart<
  P extends object = {},
  K extends keyof Proxyed<P> = never
> extends Part {
  type: PartType = 'no'
  defp?: P[K] //default prop

  constructor(index: number, def?: P[K]) {
    super(index)
    this.index = -1
    if (def !== undefined) {
      this.defp = def!
    }
  }

  setType(type: PartType) {
    this.type = type
  }

  makeReal(): Part {
    switch (this.type) {
      case 'prop':
        return new PorpPart<P, K>(this.index)
      case 'attr':
        return new AttrPart(this.index)
      case 'clip':
        return new ClipPart(this.index)
      case 'text':
        return new TextPart(this.index)
      case 'event':
        return new EventPart(this.index)
      default:
        return this
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue(val: unknown): void {}
  commit(): void {}
}

export class AttrPart extends Part {
  value!: string
  location!: { node: Element; name: string }

  commit(): void {
    let { node, name } = this.location
    node.setAttribute(name, this.value)
  }
}

export class PorpPart<
  P extends object,
  K extends keyof Proxyed<P>
> extends Part {
  value!: Proxyed<P>[K]
  location!: { node: UpdatableElement<P>; name: K }

  commit(): void {
    let { node, name } = this.location
    node.$props[name] = this.value
  }
}

export class TextPart extends Part {
  value!: string
  location!: { textNodePre: Comment | Text }

  commit(): void {
    let pre = this.location.textNodePre
    let next = new Text(this.value)
    this.location.textNodePre = next
    pre.parentNode?.replaceChild(next, pre)
  }
}

export class EventPart extends Part {
  value!: (e?: Event) => unknown
  location!: { node: Element; name: keyof DocumentEventMap }

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

  commit(): void {
    console.log(`committed`)
  }
}
