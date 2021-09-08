import { IBlock, IPanel } from '@real/interface'
import type { Direction, CornerLocation } from '@real/utils'

export class RePanel implements IPanel {
  constructor() {}

  el?: HTMLElement | undefined

  public parent?: IBlock

  divide(direction: Direction, location: CornerLocation) {
    const newPanel = new RePanel()
    const [hori, vert] = location
    let offset: number

    if (
      (hori === 'left' && direction === 'column') ||
      (vert === 'top' && direction === 'row')
    ) {
      offset = 0
    } else {
      offset = 1
    }

    if (!this.parent || direction !== this.parent?.direction) {
      const block = new ReBlock(direction)
      if (this.parent) {
        const index = this.parent.children.indexOf(this)
        this.parent.children.splice(index, 1, block)
      }
      this.parent = block
      this.parent.children.push(this)
      this.parent.children.splice(offset, 0, newPanel)
    } else {
      const index = this.parent.children.indexOf(this)
      this.parent.children.splice(index + offset, 0, newPanel)
    }

    newPanel.parent = this.parent

    return this.parent
  }

  merge(to: IPanel): void {
    throw new Error('Method not implemented.')
  }
}

export class ReBlock implements IBlock {
  children: (IBlock | IPanel)[] = []
  gridTemplate: string[] = []
  public parent?: ReBlock

  constructor(public direction: Direction) {}
}
