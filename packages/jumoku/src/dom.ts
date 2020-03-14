export const removeNodes = (
  container: Node,
  start: Node | null,
  end: Node | null = null
) => {
  while (start !== end) {
    const n = start!.nextSibling
    container.removeChild(start!)
    start = n
  }
}

export const insertAfter = (parent: Node, newNode: Node, after: Node) => {
  parent.insertBefore(newNode, after.nextSibling)
}
