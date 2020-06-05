import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'
import { VirtualElement, ReactiveElement } from '../component'

const aliveMap = new WeakMap<NodePart, Map<string, ReactiveElement>>()

class AliveVirtualElement extends VirtualElement {
  aliveFn?: (el: ReactiveElement) => unknown
  createInstance() {
    // debugger
    if (!this.el) {
      this.el = document.createElement(this.tag) as ReactiveElement
      if (this.aliveFn) {
        this.el.$alive = true
        this.aliveFn?.(this.el)
      }
    }
    this.props && this.el.mergeProps(this.props)
    return this.el
  }
}

export const keepalive = directive((view: unknown) => (part: Part) => {
  if (!(part instanceof NodePart)) {
    throw DirectivePartTypeError(part.type)
  }

  if (view instanceof VirtualElement) {
    const map = aliveMap.get(part) ?? aliveMap.set(part, new Map()).get(part)!
    const res = map.get(view.tag)
    const ae = new AliveVirtualElement(view.tag, view.props)
    if (res) {
      ae.el = res
    } else {
      ae.aliveFn = (el: ReactiveElement) => map.set(ae.tag, el)
    }
    view = ae
  }
  return view
})
