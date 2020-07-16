import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'
import { removeNodes, insertAfter } from '../dom'

export const portal = directive(
  (
    view: unknown,
    {
      container = document.body,
      after = container.lastChild
    }: { container?: Element; after?: Node | null } = {}
  ) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.constructor.name)
    }

    if (container === null) {
      throw new Error(`portal target element can not be found.`)
    }

    const { startNode, endNode } = part.location
    const parent = startNode.parentNode
    if (!parent?.isSameNode(container)) {
      const nodes = removeNodes(startNode, endNode, true)
      insertAfter(container, nodes, after)
    }
    part.setValue(view)
  }
)
