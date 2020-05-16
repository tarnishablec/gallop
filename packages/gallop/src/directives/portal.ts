import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '..'

export const portal = directive(
  (view: unknown, container: Element = document.body) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

    if (container === null) {
      throw new Error(`portal tagert Element can not be found.`)
    }

    const { startNode, endNode } = part.location
    const parent = startNode.parentElement
    if (!parent?.isSameNode(container)) {
      container.append(startNode, endNode)
    }
    return view
  }
)
