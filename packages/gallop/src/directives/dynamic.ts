import { directive } from '../directive'
import { VirtualElement } from '../component'
import { Part } from '../part'

export const dynamic = directive(
  <T extends object>(is: string, props?: T) => (part: Part) =>
    part.setPending(new VirtualElement(is, props))
)
