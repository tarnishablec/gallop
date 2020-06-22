import { shallowEqual } from './utils'
import { resolveDirective } from './directive'

type AttrPartLocation = { node: Node; name: string }
type NodePartLocation = { startNode: Node; endNode: Node }
type PartLocation = AttrPartLocation | NodePartLocation

export abstract class Part {
  protected value: unknown
  constructor(public location: PartLocation) {}
  setValue(val: unknown) {
    if (resolveDirective(val, this)) {
      return
    }
    if (!shallowEqual(val, this.value)) {
      this.value = val
      this.commit()
    }
  }
  protected abstract clear(): void
  protected abstract commit(): unknown
}

export class NodePart extends Part {
  protected clear(): void {
    throw new Error('Method not implemented.')
  }
  protected commit(): unknown {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart extends Part {
  protected clear(): void {
    throw new Error('Method not implemented.')
  }
  protected commit(): unknown {
    throw new Error('Method not implemented.')
  }
}

export class PropPart extends Part {
  protected clear(): void {
    throw new Error('Method not implemented.')
  }
  protected commit(): unknown {
    throw new Error('Method not implemented.')
  }
}

export class EventPart extends Part {
  protected clear(): void {
    throw new Error('Method not implemented.')
  }
  protected commit(): unknown {
    throw new Error('Method not implemented.')
  }
}
