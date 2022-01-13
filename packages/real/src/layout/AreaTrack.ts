import type { Direction } from '@real/utils/type'
import { v4 } from 'uuid'

export type AreaTrackProps = {
  parent?: AreaTrack
  direction: Direction
}

export type SerializedAreaTrack = Pick<AreaTrack, 'direction' | 'grids'>

export class AreaTrack {
  public id: string = v4()
  public grids: number[] = []
  public direction: Direction
  public parent?: AreaTrack
  constructor(public props: AreaTrackProps) {
    this.parent = props.parent
    this.direction = props.direction
  }

  serialize(): SerializedAreaTrack {
    return {
      grids: this.grids,
      direction: this.direction
    }
  }

  reflow() {}

  init() {}
}
