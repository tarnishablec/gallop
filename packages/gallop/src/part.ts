type AttrPartLocation = { node: Node; name: string }
type NodePartLocation = { startNode: Node; endNode: Node }
type PartLocation = AttrPartLocation | NodePartLocation

export abstract class Part {
  protected readonly value: unknown
  constructor(public location: PartLocation) {}
  abstract setValue(val: unknown): void
  abstract clear(): void
}

export class NodePart extends Part {
  value: unknown

  clear(): void {
    throw new Error('Method not implemented.')
  }
  setValue(): void {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart extends Part {
  value!: string

  clear(): void {
    throw new Error('Method not implemented.')
  }
  setValue(): void {
    throw new Error('Method not implemented.')
  }
}

export class PropPart extends Part {
  value: unknown
  clear(): void {
    throw new Error('Method not implemented.')
  }
  setValue(): void {
    throw new Error('Method not implemented.')
  }
}

export class EventPart extends Part {
  value: unknown
  clear(): void {
    throw new Error('Method not implemented.')
  }
  setValue(): void {
    throw new Error('Method not implemented.')
  }
}
