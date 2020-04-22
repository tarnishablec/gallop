export function cleanDofStr(str: string) {
  return str
    .replace(/(^\s)|(\s$)/, '')
    .replace(/>\s*/g, '>')
    .replace(/\s*</g, '<')
    .replace(/>(\s*?)</g, '><')
    .trim()
}

export function insertAfter(
  container: Node,
  newChild: Node,
  afterChild?: Node | null
) {
  return container.insertBefore(newChild, afterChild?.nextSibling ?? null)
}

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
