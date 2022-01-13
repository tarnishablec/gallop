import { AreaTrack } from './AreaTrack'

export type AreaProps = {
  panel?: string
  parent?: AreaTrack
}

export class Area {
  constructor(public props: AreaProps) {}
}
