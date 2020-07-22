import { directive, ensurePartType } from '../directive'
import { Part, NodePart } from '../part'
import { removeNodes, insertAfter } from '../dom'
import { ReactiveElement } from '../component'
import { unmountedEffectMap } from '../loop'
import { forceGet } from '../utils'

type PortalLocation = {
  host?: ReactiveElement
  container?: Element
  after?: Node | null
}

const __injected__ = Symbol('__injected__')

export const portal = directive(
  (
    view: unknown,
    {
      host,
      container = document.body,
      after = container.lastChild
    }: PortalLocation = {}
  ) => (part: Part) => {
    if (!ensurePartType(part, NodePart)) return

    if (container === null) {
      throw new Error(`portal target element can not be found.`)
    }

    const { startNode, endNode } = part.location
    const parent = startNode.parentNode
    if (!parent?.isSameNode(container)) {
      startNode.data = 'portal'
      endNode.data = 'portal'
      const nodes = removeNodes(startNode, endNode, true)
      insertAfter(container, nodes, after)
      if (host && !Reflect.get(part, __injected__)) {
        // TODO ? destroy portal
        const cbs = forceGet(unmountedEffectMap, host, () => [] as (() => unknown)[])
        cbs.push(() => part.destroy()) // possible memory leak
        Reflect.set(part, __injected__, true)
      }
    }
    part.setValue(view)
  }
)
