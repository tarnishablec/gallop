import { v4 } from 'uuid'
import type { CornerLocation } from '../types'
import { FR_UNIT } from '../utils/const'
import { AreaDragger } from './AreaDragger'
import { AreaTrack } from './AreaTrack'

export type AreaProps = {
  key?: string
  parent: AreaTrack
}

export type SerializedArea = Pick<Area, 'key'> & {
  type: 'Area'
}

export class Area {
  public readonly id = v4()
  public parent: AreaTrack
  public key?: string

  public _dom?: HTMLElement

  constructor(props: AreaProps) {
    this.key = props.key
    this.parent = props.parent
  }

  divide({
    direction,
    from
  }: {
    direction: AreaTrack['direction']
    from: CornerLocation
  }): AreaTrack[] {
    const { parent } = this

    if (parent) {
      const index = parent.children.indexOf(this)
      let indexOffset: number

      if (direction === 'horizontal') {
        const [h] = from
        if (h === 'left') {
          indexOffset = 0
        } else {
          indexOffset = 1
        }
      } else {
        const [, v] = from
        if (v === 'top') {
          indexOffset = 0
        } else {
          indexOffset = 1
        }
      }

      if (parent.direction === direction) {
        const { grids } = parent

        grids[index] = grids[index] - 11

        grids.splice(index + indexOffset, 0, 10)

        parent.grids = [...parent.grids]

        parent.children.splice(index + indexOffset, 0, new Area({ ...this }))

        parent.draggers.splice(
          index + indexOffset,
          0,
          new AreaDragger({ parent })
        )
        return [parent]
      } else {
        const newTrack = new AreaTrack({ parent, direction })
        parent.children.splice(index, 1, newTrack)
        this.parent = newTrack
        newTrack.children.push(this)
        newTrack.children.splice(index + indexOffset, 0, new Area({ ...this }))
        const field =
          direction === 'horizontal' ? 'clientWidth' : 'clientHeight'
        newTrack.draggers = [new AreaDragger({ parent: newTrack })]
        newTrack.grids = [this._dom![field] / FR_UNIT]
        newTrack.grids.splice(indexOffset, 0, 11)
        return [parent, newTrack]
      }
    } else {
      return []
    }
  }
}
