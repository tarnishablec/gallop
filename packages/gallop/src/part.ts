type AttrPartLocation = { node: Node; name: string }
type NodePartLocation = { startNode: Node; endNode: Node }
type PartLocation = AttrPartLocation | NodePartLocation

export interface Part {
  value: unknown
  location: PartLocation
  setValue(val: unknown): void
  clear(): void
  commit(): unknown
}

export class NodePart implements Part {
  value: unknown

  constructor(public location: NodePartLocation) {}

  setValue(val: unknown): void {
    throw new Error('Method not implemented.')
  }
  clear(): void {
    throw new Error('Method not implemented.')
  }
  commit(): unknown {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart implements Part {
  value: unknown

  constructor(public location: AttrPartLocation) {}

  setValue(val: unknown): void {
    throw new Error('Method not implemented.')
  }
  clear(): void {
    throw new Error('Method not implemented.')
  }
  commit(): unknown {
    throw new Error('Method not implemented.')
  }
}

export class PropPart implements Part {
  value: unknown

  constructor(public location: AttrPartLocation) {}

  setValue(val: unknown): void {
    throw new Error('Method not implemented.')
  }
  clear(): void {
    throw new Error('Method not implemented.')
  }
  commit(): unknown {
    throw new Error('Method not implemented.')
  }
}

export class EventPart implements Part {
  value: unknown

  constructor(public location: AttrPartLocation) {}

  setValue(val: unknown): void {
    throw new Error('Method not implemented.')
  }
  clear(): void {
    throw new Error('Method not implemented.')
  }
  commit(): unknown {
    throw new Error('Method not implemented.')
  }
}
