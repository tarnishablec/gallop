import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'
import { ReactiveElement, mergeProps, componentPool } from '../component'
import { Obj } from '../utils'

const partElCache = new WeakMap<NodePart, ReactiveElement>()

export const dynamic = directive((name: string, props: Obj) => (part: Part) => {
  if (!(part instanceof NodePart))
    throw DirectivePartTypeError(part.constructor.name)

  const { endNode } = part.location

  const lastEl = partElCache.get(part)
  if (lastEl?.localName === name) mergeProps(lastEl, props)
  else {
    if (!componentPool.has(name))
      throw new SyntaxError(`[${name}] is not a ReactiveElement`)
    const el = document.createElement(name) as ReactiveElement
    part.clear()
    endNode.parentElement?.insertBefore(el, endNode)
    partElCache.set(part, el)
  }
})
