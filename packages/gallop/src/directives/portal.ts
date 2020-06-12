import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '..'
import { removeNodes } from '../dom'

export const portal = directive(
  (view: unknown, container: Element = document.body) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

    if (container === null) {
      throw new Error(`portal target element can not be found.`)
    }

    const { startNode, endNode } = part.location
    const parent = startNode.parentElement
    if (!parent?.isSameNode(container)) {
      const cbs = part.destroyedCallbacks ?? (part.destroyedCallbacks = [])
      cbs.push(() => {
        removeNodes(startNode.parentNode!, startNode, endNode.nextSibling)
      })
      const hash = `portal-${Math.random().toString().slice(2)}`
      parent?.insertBefore(new Comment(hash), startNode)
      startNode.replaceData(0, 1, hash)
      endNode.replaceData(0, 1, hash)
      parent && removeNodes(parent, startNode.nextSibling, endNode)
      container.append(startNode, endNode)
    }
    part.setValue(view)
  }
)
