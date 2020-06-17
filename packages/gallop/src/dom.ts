import { markerIndex } from './marker'

export const cleanDofStr = (str: string) =>
  str.replace(/((?=>|^)\s*)|(\s*(?=<|$))/g, '')

export function insertAfter(
  container: Node,
  newChild: Node,
  afterChild?: Node | null
) {
  return container.insertBefore(
    newChild,
    afterChild ? afterChild.nextSibling ?? null : container.firstChild
  )
}

/**
 * [)
 */
export function removeNodes(
  container: Node,
  start: Node | null = container.firstChild,
  end: Node | null = null
) {
  const removed = new DocumentFragment()
  while (start !== end) {
    const n = start!.nextSibling
    removed.append(container.removeChild(start!))
    start = n
  }
  return removed
}

export const resetCommentMarker = (marker: Comment) => {
  const data = marker.data
  const { length } = data
  marker.replaceData(0, length, markerIndex)
}
