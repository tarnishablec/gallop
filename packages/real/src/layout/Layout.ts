import { Area } from './Area'
import { AreaTrack } from './AreaTrack'

export class Layout {
  protected areaOrTrackList: (AreaTrack | Area)[] = []

  public serializedData: object[] = []

  generate() {}

  serialize() {}

  save() {}
}
