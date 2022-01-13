import { v4 } from 'uuid'
import { AreaTrack } from './AreaTrack'

export class Layout {
  public readonly id = v4()

  public rootAreaTrack?: AreaTrack
  public name: string

  constructor({
    rootAreaTrack,
    name
  }: {
    rootAreaTrack: AreaTrack
    name: string
  }) {
    this.rootAreaTrack = rootAreaTrack
    this.name = name
  }
}
