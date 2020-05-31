import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'
import { VirtualElement, ReactiveElement } from '../component'

// const clipAliveMap = new WeakMap<NodePart, Map<string, NodeValueType>>()
const virtAliveMap = new WeakMap<NodePart, Map<string, ReactiveElement>>()

export const keepalive = directive((view: unknown) => (part: Part) => {
  if (!(part instanceof NodePart)) {
    throw DirectivePartTypeError(part.type)
  }

  if (view instanceof VirtualElement) {
    const map =
      virtAliveMap.get(part) ?? virtAliveMap.set(part, new Map()).get(part)!
    const res = map.get(view.tag)
    if (res) {
      view.el = res
    } else {
      view.aliveFn = (el: ReactiveElement) => map.set(view.tag, el)
    }
  }
  return view
})
