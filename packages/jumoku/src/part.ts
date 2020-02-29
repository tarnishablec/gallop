export abstract class Part {
  readonly value: unknown

  constructor(val: unknown) {
    this.value = val
  }

  abstract tryUpdate(val: unknown): unknown
}

export class AttrPart extends Part {
  readonly targetNode: Element

  constructor(node: Element, name: string, val: string) {
    super(val)
    this.targetNode = node
  }

  tryUpdate(val: string) {
    this.targetNode.setAttribute(name, val)
  }
}
