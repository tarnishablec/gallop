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

export const generateEventOptions = (
  set: Set<string>
): AddEventListenerOptions => ({
  capture: set.has('capture'),
  once: set.has('once'),
  passive: set.has('passive')
})

const range = new Range()
const tableRange = new Range()

const table = document.createElement('table')
const tbody = document.createElement('tbody')
const tr = document.createElement('tr')
const colgroup = document.createElement('colgroup')

/**
 * https://stackoverflow.com/questions/43102944/cannot-create-documentfragment-storing-td-tr-or-th
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Table_content
 */
export function createFragment(str: string) {
  const firstTag = str.match(/^<([a-z]+)/)?.[1]
  if (
    firstTag &&
    [
      'tbody',
      'thead',
      'tfoot',
      'caption',
      'colgroup',
      'col',
      'tr',
      'td',
      'th'
    ].includes(firstTag)
  ) {
    switch (firstTag) {
      case 'tbody':
      case 'thead':
      case 'tfoot':
      case 'caption':
      case 'colgroup':
        tableRange.selectNodeContents(table)
        break
      case 'tr':
        tableRange.selectNodeContents(tbody)
        break
      case 'td':
      case 'th':
        tableRange.selectNodeContents(tr)
        break
      case 'col':
        tableRange.selectNodeContents(colgroup)
        break
      default:
        break
    }
    return tableRange.createContextualFragment(str)
  }
  return range.createContextualFragment(str)
}
