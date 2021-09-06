import { ReactiveElement } from '@gallop/gallop'
import { Direction } from '@real/utils'
import { IBlock, IEditor, IPanel } from '../models/index'

export class ReEditor implements IEditor {
  constructor(public el: ReactiveElement) {}
  layout = []
  tagname = 're-editor'
  destroy(): void {
    throw new Error('Method not implemented.')
  }
}

export class ReBlock implements IBlock {
  children = []
  constructor(public el: ReactiveElement, public direction: Direction) {}
  tagname = 're-block'
  destroy(): void {
    throw new Error('Method not implemented.')
  }
}

export class RePanel implements IPanel {
  constructor(public el: ReactiveElement) {}
  seprate(): IBlock {
    throw new Error('Method not implemented.')
  }

  tagname = 're-panel'
  destroy(): void {
    throw new Error('Method not implemented.')
  }
}
