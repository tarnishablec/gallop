import { UpdatableElement } from './updatableElement'

type PartLocation =
  | { node: Node; name: string }
  | { startNode: Comment; endNode: Comment }
  | { textNodePre: Comment }

type PartType = 'attr' | 'prop' | 'clip' | 'text' | 'no'
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
  abstract commit(): void
  abstract equals(): boolean
}

export class ShallowPart<
  P extends object = {},
  K extends keyof P = never
> extends Part {
  type: PartType = 'no'
  def?: P[K]

  constructor(index: number, def?: P[K]) {
    super(index)
    this.index = -1
    if (def !== undefined) {
      this.def = def!
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
      case 'no':
        return this
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue(val: unknown): void {}
  commit(): void {}
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart extends Part {
  value!: string
  location!: { node: Element; name: string }

  constructor(index: number) {
    super(index)
  }

  commit(): void {
    let { node, name } = this.location
    node.setAttribute(name, this.value)
  }
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
}

export class PorpPart<P extends object, K extends keyof P> extends Part {
  value!: P[K]
  location!: { node: UpdatableElement<P>; name: K }

  constructor(index: number) {
    super(index)
  }
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    let { node, name } = this.location
    node.$props[name] = this.value
  }
}

export class TextPart extends Part {
  value!: string
  location!: { textNodePre: Comment | Text }

  constructor(index: number) {
    super(index)
  }

  commit(): void {
    let pre = this.location.textNodePre
    let next = new Text(this.value)
    this.location.textNodePre = next
    pre.parentNode?.replaceChild(next, pre)
  }
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
}

export class ClipPart extends Part {
  value: unknown
  location!: { startNode: Comment; endNode: Comment }

  constructor(index: number) {
    super(index)
  }
  equals(): boolean {
    throw new Error('Method not implemented.')
  }

  commit(): void {
    console.log(`committed`)
  }
}
