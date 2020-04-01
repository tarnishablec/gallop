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
  afterChild?: Node
) {
  return container.insertBefore(newChild, afterChild?.nextSibling ?? null)
}

export function removeNodes(
  container: Node,
  start: Node | null,
  end: Node | null = null
) {
  while (start !== end) {
    const n = start!.nextSibling
    container.removeChild(start!)
    start = n
  }
}
