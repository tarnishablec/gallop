import { Clip } from './clip'

export interface Part {}

export interface Part {
  index: number
  value: unknown
  setValue(val: unknown): void
  commit(): void
  equals(): boolean
}

export class ClipPart implements Part {
  value: unknown
  startNode!: Node
  endNode!: Node
  index: number = -1

  constructor(index: number) {
    this.index = index
  }
  equals(): boolean {
    throw new Error('Method not implemented.')
  }

  setValue(val: unknown): void {}
  commit(): void {
    console.log(`committed`)
  }
}
