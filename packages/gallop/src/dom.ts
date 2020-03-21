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

export const getNodesBetween = (start: Node, end: Node) => {
  if (!start.parentNode?.isSameNode(end.parentNode)) {
    throw new Error('not same parent')
  }

  let res: Node[] = []
  let n = start.nextSibling!
  while (!n.isSameNode(end)) {
    res.push(n)
    n = n.nextSibling!
  }
  return res
}
