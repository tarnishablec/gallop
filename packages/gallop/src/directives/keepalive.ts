import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'
import { VirtualElement, ReactiveElement } from '../component'

type Matchers = (string | RegExp)[]

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

export const keepalive = directive(
  (
    view: unknown,
    {
      include,
      exclude
    }: {
      include?: Matchers
      exclude?: Matchers
    } = {}
  ) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

    if (view instanceof VirtualElement) {
      const { tag, props } = view

      if (
        (!exclude || !matches(exclude, tag)) &&
        (!include || matches(include, tag))
      ) {
        const map =
          aliveMap.get(part) ?? aliveMap.set(part, new Map()).get(part)!
        const res = map.get(tag)
        const ae = new AliveVirtualElement(tag, props)
        if (res) {
          ae.el = res
        } else {
          ae.aliveFn = (el: ReactiveElement) => map.set(ae.tag, el)
        }
        view = ae
      }
    }
    return part.setPending(view)
  }
)

const matches = (matcher: Matchers, tag: string) =>
  matcher.some((m) => {
    if (typeof m === 'string') {
      return m === tag
    } else {
      return m.test(tag)
    }
  })
