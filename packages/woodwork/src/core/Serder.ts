import { type SerializedArea, Area } from './Area'
import { type SerializedAreaTrack, AreaTrack } from './AreaTrack'
import { AreaDragger } from './AreaDragger'

export interface IWWSerder {
  serializeArea(area: Area): SerializedArea
  serializeAreaTrack(area: AreaTrack): SerializedAreaTrack

  deserializeArea(serializedArea: SerializedArea): Area
  deserializeAreaTrack(serializedAreaTrack: SerializedAreaTrack): AreaTrack
}

export class WWSerder implements IWWSerder {
  serializeArea(area: Area): SerializedArea {
    return { type: 'Area', key: area.key }
  }
  serializeAreaTrack(area: AreaTrack): SerializedAreaTrack {
    return {
      grids: area.grids,
      direction: area.direction,
      children: area.children
        .map((v) =>
          v instanceof AreaTrack
            ? this.serializeAreaTrack(v)
            : v instanceof Area
            ? this.serializeArea(v)
            : undefined
        )
        .filter(
          (v): v is SerializedArea | SerializedAreaTrack => v !== undefined
        ),
      type: 'AreaTrack'
    }
  }
  deserializeArea(serializedArea: SerializedArea): Area {
    const area = new Area({
      key: serializedArea.key,
      parent: new AreaTrack({ direction: 'horizontal' })
    })
    return area
  }
  deserializeAreaTrack(serializedAreaTrack: SerializedAreaTrack): AreaTrack {
    const track = new AreaTrack({
      direction: serializedAreaTrack.direction,
      grids: [...serializedAreaTrack.grids]
    })

    track.children = serializedAreaTrack.children.map((v) => {
      if (v.type === 'AreaTrack') {
        return this.deserializeAreaTrack(v)
      }
      return this.deserializeArea(v)
    })

    for (let index = 0; index < track.children.length - 1; index++) {
      track.draggers.push(new AreaDragger({ parent: track }))
    }

    track.children.forEach((child) => {
      child.parent = track
    })

    return track
  }
}
