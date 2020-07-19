import { directive, ensurePartType } from '../directive'
import { NodePart } from '../part'
import { ReactiveElement, mergeProps, componentPool } from '../component'
import { Obj } from '../utils'

const partElCache = new WeakMap<NodePart, ReactiveElement>()

export const dynamic = directive((name: string, props: Obj = {}) => (part) => {
  if (!ensurePartType(part, NodePart)) return
  const { endNode } = part.location

  const lastEl = partElCache.get(part)
  if (lastEl?.localName === name) return mergeProps(lastEl, props)
  else {
    if (!componentPool.has(name))
      throw new SyntaxError(`[${name}] is not a ReactiveElement`)
    part.clear()
    const el = document.createElement(name) as ReactiveElement
    mergeProps(el, props)
    endNode.parentNode!.insertBefore(el, endNode)
    partElCache.set(part, el)
  }
})
