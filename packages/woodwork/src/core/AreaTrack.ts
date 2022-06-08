import { v4 } from 'uuid'
import type { Direction } from '../types'
import { Area, type SerializedArea } from './Area'
import { AreaDragger } from './AreaDragger'

export type AreaTrackProps = {
  parent?: AreaTrack['parent']
  direction: AreaTrack['direction']
  grids?: AreaTrack['grids']
}

export type SerializedAreaTrack = Pick<AreaTrack, 'direction' | 'grids'> & {
  children: (SerializedAreaTrack | SerializedArea)[]
  type: 'AreaTrack'
}

export class AreaTrack {
  public readonly id = v4()
  public grids: number[] = []
  public draggers: AreaDragger[] = []
  public direction: Direction
  public parent?: AreaTrack
  public children: (AreaTrack | Area)[] = []

  public _dom?: HTMLElement

  constructor(props: AreaTrackProps) {
    this.parent = props.parent
    this.direction = props.direction
    if (props.grids) {
      this.grids = props.grids
    }
  }
}
