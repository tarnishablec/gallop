import {
  directive,
  ensurePartType,
  NodePart,
  type ReactiveElement,
  mergeProps,
  componentPool,
  HTMLClip,
  type Obj
} from '@gallop/gallop'

const partElCache = new WeakMap<NodePart, ReactiveElement>()
const partSlotCache = new WeakMap<NodePart, NodePart>()

export const dynamic = directive(
  ({ name, props, inner }: { name: string; props?: Obj; inner?: HTMLClip }) =>
    (part) => {
      if (!ensurePartType(part, NodePart)) return
      const { endNode } = part.location

      let el = partElCache.get(part)
      let elChanged = false
      if (el?.localName === name) {
        props && mergeProps(el, props)
      } else {
        elChanged = true
        if (!componentPool.has(name))
          throw new SyntaxError(`[${name}] is not a ReactiveElement`)
        part.clear()
        el = document.createElement(name) as ReactiveElement
        props && mergeProps(el, props)
        endNode.parentNode!.insertBefore(el, endNode)
        partElCache.set(part, el)
      }

      if (inner) {
        let p = partSlotCache.get(part)
        if (!p) {
          p = NodePart.create()
          partSlotCache.set(part, p)
        }
        elChanged && p.moveInto(el)
        p.setValue(inner)
      }
    }
)
