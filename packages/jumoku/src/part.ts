export interface Part {
  readonly value: unknown

  setValue(value: unknown): void

  commit(): void

  equals(): boolean
}

export class ClipPart implements Part {
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
  value: unknown
  setValue(value: unknown): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    throw new Error('Method not implemented.')
  }
}

export class AttrPart implements Part {
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
  value: unknown
  setValue(value: unknown): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    throw new Error('Method not implemented.')
  }
}

export class EventPart implements Part {
  equals(): boolean {
    throw new Error('Method not implemented.')
  }
  value: unknown
  setValue(value: unknown): void {
    throw new Error('Method not implemented.')
  }
  commit(): void {
    throw new Error('Method not implemented.')
  }
}
