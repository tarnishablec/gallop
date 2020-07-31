export const cleanDomStr = (str: string) =>
  str.replace(/((?=>|^)\s+)|(\s+(?=<|$))/g, '')

export const insertAfter = (
  container: Node,
  newChild: Node,
  afterChild?: Node | null
) => container.insertBefore(newChild, afterChild?.nextSibling ?? null)

export function removeNodes(
  startNode: Node,
  endNode: Node,
  edge = false
): DocumentFragment {
  const range = new Range()
  edge ? range.setStartBefore(startNode) : range.setStartAfter(startNode)
  edge ? range.setEndAfter(endNode) : range.setEndBefore(endNode)
  return range.extractContents()
}

export const generateEventOptions = (set: Set<string>): AddEventListenerOptions => ({
  capture: set.has('capture'),
  once: set.has('once'),
  passive: set.has('passive')
})
