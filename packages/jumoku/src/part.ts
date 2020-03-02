import { ShallowClip } from './clip'

type PartLocation =
  | { node: Node; name: string }
  | { startNode: Node; endNode: Node }

export abstract class Part {
  index: number
  value: unknown
  type!: 'attr' | 'prop' | 'clip' | 'no'
  protected location!: PartLocation

  setLocation(location: PartLocation) {
    this.location = location
  }

  constructor(index: number) {
    this.index = index
  }

  abstract setValue(val: unknown): void
  abstract commit(): void
  abstract equals(): boolean
}

export class NoPart extends Part {
  constructor(index: number) {
    super(index)
    this.type = 'no'
  }

  setValue(val: unknown): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    throw new Error('Method not implemented.')
  }
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart extends Part {
  value: string = ''

  constructor(index: number) {
    super(index)
    this.type = 'attr'
  }

  setValue(val: unknown): void {}
  commit(): void {}
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
}

export class PorpPart extends Part {
  constructor(index: number) {
    super(index)
    this.type = 'prop'
  }
  setValue(val: unknown): void {}
  commit(): void {}
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
}

export class ClipPart extends Part {
  value: unknown

  constructor(index: number) {
    super(index)
    this.type = 'clip'
  }
  equals(): boolean {
    throw new Error('Method not implemented.')
  }

  setValue(val: unknown): void {}
  commit(): void {
    console.log(`committed`)
  }
}
