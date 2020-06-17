import { VirtualElement } from '../virtual'

export const dynamic = <T extends object>(is: string, props?: T) =>
  new VirtualElement(is, props)
