import { directive, ensurePartType } from '../directive'
import { NodePart } from '../part'
import { ReactiveElement, mergeProps, elementPool } from '../component'
import { Obj } from '../utils'
import { HTMLClip } from '../clip'

const partElCache = new WeakMap<NodePart, ReactiveElement>()
const partSlotCache = new WeakMap<NodePart, NodePart>()

export const dynamic = directive(
  ({ name, props, inner }: { name: string; props?: Obj; inner?: HTMLClip }) => (
    part
  ) => {
    if (!ensurePartType(part, NodePart)) return
    const { endNode } = part.location

    let el = partElCache.get(part)
    let elChanged = false
    if (el?.localName === name) {
      mergeProps(el, props)
    } else {
      elChanged = true
      if (!elementPool.has(name))
        throw new SyntaxError(`[${name}] is not a ReactiveElement`)
      part.clear()
      el = document.createElement(name) as ReactiveElement
      mergeProps(el, props)
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
