import { directive } from '../directive'
import { VirtualElement, componentPool, ComponentArgs } from '../component'
import { HTMLClip } from '../clip'

export const dynamic = directive(
  <T extends object>(
    is: string,
    props?: ComponentArgs,
    slotContent?: HTMLClip
  ) => () => {
    const propNames = componentPool.get(is)
    if (!propNames) {
      return null
    }
    return new VirtualElement(is, props).useSlot(slotContent)
  }
)
