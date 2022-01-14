import { v4 } from 'uuid'
import { Direction } from '../types'
import { AreaTrack } from './AreaTrack'

export type AreaDraggerProps = {
  parent: AreaTrack
}

export class AreaDragger {
  public readonly id = v4()
  public direction: Direction
  public parent: AreaTrack

  public _dom?: HTMLElement

  constructor(props: AreaDraggerProps) {
    this.parent = props.parent
    this.direction = props.parent.direction
  }
}
