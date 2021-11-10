import { Entity } from '@real/core/Entity'

export type AreaProps = {
  panel?: string
}

export class Area extends Entity<AreaProps> {
  constructor(props: AreaProps) {
    super(props)
  }
}
