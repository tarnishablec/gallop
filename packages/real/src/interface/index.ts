import { Direction } from '@real/utils'

export interface IEditor {}

export interface ISerializable {
  serialize(): void
}

export interface IWidget {
  el?: HTMLElement
  index?: number
  parent?: IBlock
}

export interface IBlock extends ISerializable, IWidget {
  direction: Direction
  children: IWidget[]
  gridTemplate: string[]
  collapse(): IPanel
}

export interface IPanel extends ISerializable, IWidget {
  divide(direction: Direction): IBlock
}
