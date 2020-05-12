import { directive } from '../directive'
import { VirtualElement, componentPool } from '../component'
import { HTMLClip } from '../clip'

export const dynamic = directive(
  <T extends object>(is: string, props?: T, slotContent?: HTMLClip) => () => {
    const propNames = componentPool.get(is)
    if (!propNames) {
      return null
    }
    const res =
      props &&
      propNames.reduce((acc, cur) => {
        return [...acc, Reflect.get(props, cur)]
      }, [] as unknown[])
    return new VirtualElement(is, res).useSlot(slotContent)
  }
)
