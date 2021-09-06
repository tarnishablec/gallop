import type { Direction } from '@real/utils'

export interface IWidget {
  el: HTMLElement
  tagname: string
  destroy(): void
}

export interface IEditor extends IWidget {
  layout: (IPanel | IBlock)[]
}

export interface IMenu extends IWidget {}

export interface IBlock extends IWidget {
  direction: Direction
  children: (IBlock | IPanel)[]
}

export interface IPanel extends IWidget {
  seprate(): IBlock
}
