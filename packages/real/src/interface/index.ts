import type { Direction, CornerLocation } from '@real/utils'

export interface IEditor {}

export type SerializedWidget = {
  type: string
  id: string
  parent: string
  children?: string[]
}

export interface IWidget {
  el?: HTMLElement
  parent?: IBlock
  serialize(): SerializedWidget
}

export interface IBlock extends IWidget {
  direction: Direction
  children: IWidget[]
  gridTemplate: string[]
}

export interface IPanel extends IWidget {
  divide(direction: Direction, location: CornerLocation): IBlock
  merge(to: IPanel): void
}
