import { directive } from '../directive'
import { VirtualElement } from '../component'

export const dynamic = directive(
  <T extends object>(is: string, props?: T) => () =>
    new VirtualElement(is, props)
)
