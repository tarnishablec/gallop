import {
  directive,
  ensurePartType,
  type Part,
  NodePart,
  removeNodes,
  insertAfter,
  type ReactiveElement,
  observeDisconnect
} from '@gallop/gallop'

type PortalOptions = {
  host?: ReactiveElement
  container?: Element
  after?: Node | null
}

export const portal = directive(
  (
      view: unknown,
      {
        host,
        container = document.body,
        after = container.lastChild
      }: PortalOptions = {}
    ) =>
    (part: Part) => {
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
        if (host) observeDisconnect(host, () => part.destroy())
      }
      part.setValue(view)
    }
)
