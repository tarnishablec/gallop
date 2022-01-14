import { SerializedArea, Area } from './Area'
import { SerializedAreaTrack, AreaTrack } from './AreaTrack'
import { AreaDragger } from './AreaDragger'

export interface IWWSerder {
  serializeArea(area: Area): SerializedArea
  serializeAreaTrack(area: AreaTrack): SerializedAreaTrack

  deserializeArea(serializedArea: SerializedArea): Area
  deserializeAreaTrack(serializedAreaTrack: SerializedAreaTrack): AreaTrack
}

export class WWSerder implements IWWSerder {
  serializeArea(area: Area): SerializedArea {
    return { type: 'Area', renderKey: area.renderKey }
  }
  serializeAreaTrack(area: AreaTrack): SerializedAreaTrack {
    return {
      grids: area.grids,
      direction: area.direction,
      children: area.children.map((v) =>
        v instanceof AreaTrack
          ? this.serializeAreaTrack(v)
          : this.serializeArea(v)
      ),
      type: 'AreaTrack'
    }
  }
  deserializeArea(serializedArea: SerializedArea): Area {
    const area = new Area({ renderKey: serializedArea.renderKey })
    return area
  }
  deserializeAreaTrack(serializedAreaTrack: SerializedAreaTrack): AreaTrack {
    const track = new AreaTrack({
      direction: serializedAreaTrack.direction
    })

    track.grids = [...serializedAreaTrack.grids]
    track.children = serializedAreaTrack.children
      .map((v) => {
        if (v.type === 'AreaTrack') {
          return this.deserializeAreaTrack(v)
        }
        return this.deserializeArea(v)
      })
      .flatMap((v) => [v, new AreaDragger({ parent: track })])

    track.children.pop()

    track.children.forEach((child) => {
      child.parent = track
    })

    return track
  }
}
