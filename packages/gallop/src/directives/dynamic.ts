import { VirtualElement } from '../component'

export const dynamic = <T extends object>(is: string, props?: T) =>
  new VirtualElement(is, props)
