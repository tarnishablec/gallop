export const cleanDomStr = (str: string) =>
  str.replace(/((?<=>|^)\s+)|(\s+(?=<|$))/g, '')

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

export const generateEventOptions = (
  set: Set<string>
): AddEventListenerOptions => ({
  capture: set.has('capture'),
  once: set.has('once'),
  passive: set.has('passive')
})
