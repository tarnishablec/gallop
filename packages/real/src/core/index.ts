import { IBlock, IPanel, IWidget } from '@real/interface'
import { Direction } from '@real/utils'

export class RePanel implements IPanel {
  constructor(public el: HTMLElement) {}

  public parent?: ReBlock
  public index?: number

  divide(direction: Direction) {
    if (this.parent && this.index !== undefined) {
    }
    const block = new ReBlock(direction)
    return block
  }
  serialize(): void {
    throw new Error('Method not implemented.')
  }
}

export class ReBlock implements IBlock {
  children: IWidget[] = []
  gridTemplate: string[] = []

  constructor(public direction: Direction) {}

  collapse(): IPanel {
    throw new Error('Method not implemented.')
  }
  serialize(): void {
    throw new Error('Method not implemented.')
  }
  index?: number | undefined
  parent?: IBlock | undefined
}
