import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '..'
import { removeNodes, insertAfter, resetCommentMarker } from '../dom'

export const portal = directive(
  (
    view: unknown,
    {
      container = document.body,
      after
    }: { container?: Element; after?: Node } = {}
  ) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

    if (container === null) {
      throw new Error(`portal target element can not be found.`)
    }

    const { startNode, endNode } = part.location
    const parent = startNode.parentNode
    if (!parent?.isSameNode(container)) {
      const cbs = part.destroyedCallbacks ?? (part.destroyedCallbacks = [])
      const hash = Math.random().toString().slice(2)
      const anchor = new Comment(`anchor-${hash}`)
      parent?.insertBefore(anchor, startNode)
      startNode.replaceData(0, 1, `portal-${hash}`)
      endNode.replaceData(0, 1, `portal-${hash}`)
      cbs.push(() => {
        removeNodes(startNode.parentNode!, startNode.nextSibling, endNode)
        insertAfter(parent!, startNode, anchor)
        insertAfter(parent!, endNode, startNode)
        resetCommentMarker(startNode)
        resetCommentMarker(endNode)
        anchor.remove()
        Reflect.set(part, 'value', undefined)
      })
      parent && removeNodes(parent, startNode.nextSibling, endNode)
      insertAfter(container, startNode, after ?? container.lastChild)
      insertAfter(container, endNode, startNode)
      // container.append(startNode, endNode)
    }
    part.setValue(view)
  }
)
