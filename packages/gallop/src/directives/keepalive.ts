/* eslint-disable @typescript-eslint/no-unused-vars */
import { directive } from '../directive'
import { Part, NodePart, NodeValueType } from '../part'
import { DirectivePartTypeError } from '../error'
import { HTMLClip } from '../clip'
import { VirtualElement } from '../component'

const aliveMap = new WeakMap<NodePart, NodeValueType>()

export const keepalive = directive(
  (view: unknown) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

    // if (view instanceof HTMLClip || view instanceof VirtualElement) {
    //   aliveMap.get(part) ?? aliveMap.set(part, part.setValue(view)!)
    // } else {
    //   part.setValue(view)
    // }
  },
  true
)
