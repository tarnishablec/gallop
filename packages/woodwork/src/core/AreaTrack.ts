import { v4 } from 'uuid'
import type { Direction } from '../types'
import { Area, SerializedArea } from './Area'

export type AreaTrackProps = {
  parent?: AreaTrack
  direction: Direction
}

export type SerializedAreaTrack = Pick<AreaTrack, 'direction' | 'grids'> & {
  children: (SerializedAreaTrack | SerializedArea)[]
  type: 'AreaTrack'
}

export class AreaTrack {
  public readonly id = v4()
  public grids: number[] = []
  public direction: Direction
  public parent?: AreaTrack
  public children: (AreaTrack | Area)[] = []

  constructor(public props: AreaTrackProps) {
    this.parent = props.parent
    this.direction = props.direction
  }

  reflow() {}
}
