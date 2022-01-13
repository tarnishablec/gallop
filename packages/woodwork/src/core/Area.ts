import { v4 } from 'uuid'
import { AreaTrack } from './AreaTrack'

export type AreaProps = {
  renderKey?: string
  parent?: AreaTrack
}

export type SerializedArea = Pick<Area, 'renderKey'> & {
  type: 'Area'
}

export class Area {
  public readonly id = v4()
  public parent?: AreaTrack
  public renderKey?: string
  constructor(props: AreaProps) {
    this.renderKey = props.renderKey
  }
}
