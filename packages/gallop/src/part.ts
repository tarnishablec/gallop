export abstract class Part {
  index: number
  value: unknown

  constructor(index: number) {
    this.index = index
  }
}

export class NodePart extends Part {}

export class AttrPart extends Part {
  constructor(index: number) {
    super(index)
  }
}

export function createPart() {}
