export const removeNodes = (
  container: Node,
  start: Node | null,
  end: Node | null = null
): void => {
  while (start !== end) {
    const n = start!.nextSibling
    container.removeChild(start!)
    start = n
  }
}
