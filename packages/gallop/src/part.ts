import { ShallowClip } from './clip'
import { UpdatableElement } from './component'
import { shallowEqual } from './utils'

type AttrEventLocation = { node: Element; name: string }
type PropLocation = { node: UpdatableElement; name: string }
type NodeLocation = { startNode: Comment; endNode: Comment }

type PartLocation = AttrEventLocation | PropLocation | NodeLocation
type PartType = 'node' | 'attr' | 'event' | 'prop'

export abstract class Part {
  index: number
  value: unknown
  location: PartLocation
  type: PartType

  constructor(
    index: number,
    initVal: unknown,
    location: PartLocation,
    type: PartType
  ) {
    this.index = index
    this.value = initVal
    this.location = location
    this.type = type
  }

  setValue(val: unknown) {
    if (shallowEqual(this.value, val)) {
    }
  }
}

export class NodePart extends Part {
  value!: string | ShallowClip | ShallowClip[] | null
  location!: NodeLocation
}

export class AttrPart extends Part {
  value!: string
  location!: AttrEventLocation
}

export class EventPart extends Part {
  value!: Event
  location!: AttrEventLocation
}

export class PropPart extends Part {
  location!: PropLocation
}
