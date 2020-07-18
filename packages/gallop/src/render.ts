import { HTMLClip, createPatcher, getVals } from './clip'
import { markerIndex } from './marker'
import { removeNodes } from './dom'

/**
 * @returns ununmout function
 */
export function render(
  view: HTMLClip,
  {
    container = document.body,
    before = container.firstChild
  }: { container?: Node; before?: Node | null } = {}
) {
  const patcher = view.do(createPatcher).patch(view.do(getVals))
  const startNode = new Comment(markerIndex)
  const endNode = new Comment(markerIndex)
  container.insertBefore(endNode, before)
  container.insertBefore(startNode, endNode)
  const dof = patcher.dof
  container.insertBefore(dof, endNode)
  return () => removeNodes(startNode, endNode, true)
}
