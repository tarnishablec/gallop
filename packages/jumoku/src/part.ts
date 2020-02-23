export interface Part {
  readonly value: unknown

  setValue(value: unknown): void

  commit(): void
}

export class ClipPart implements Part {
  value: unknown
  setValue(value: unknown): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart implements Part {
  value: unknown
  setValue(value: unknown): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    throw new Error('Method not implemented.')
  }
}

export class EventPart implements Part {
  value: unknown
  setValue(value: unknown): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    throw new Error('Method not implemented.')
  }
}
