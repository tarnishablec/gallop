import { Part, AttrPart, PropPart, EventPart, NodePart } from './part'
import { StyleInTemplateError } from './error'
import { marker, markerIndex, isMarker } from './marker'
import { insertAfter } from './dom'

/**
 * createTreeWalker vs createNodeIterator
 * https://jsperf.com/getcomments/6
 */
function createParts(patcher: Patcher) {
  const result: Part[] = []
  const { dof, size } = patcher
  const walker = document.createTreeWalker(dof, 133)
  let count = 0
  while (count < size) {
    walker.nextNode()
    const { currentNode: cur } = walker

    if (cur === null) break
    if (cur instanceof HTMLStyleElement) throw StyleInTemplateError(cur)

    if (cur instanceof Element) {
      const { attributes: attrs } = cur
      const { length } = attrs

      const trash: string[] = []
      for (let i = 0; i < length; i++) {
        const { name: n } = attrs[i]
        const prefix = n[0]
        if (
          prefix === '.' ||
          prefix === '@' ||
          (prefix === ':' && marker === attrs[i].value)
        ) {
          const name = n.slice(1)
          switch (prefix) {
            case '.':
              result.push(new AttrPart({ node: cur, name }))
              break
            case ':':
              result.push(new PropPart({ node: cur, name }))
              break
            case '@':
              result.push(new EventPart({ node: cur, name }))
              break
          }
          trash.push(n)
          count++
        }
      }
      window.requestIdleCallback?.(() =>
        trash.forEach((t) => cur.removeAttribute(t))
      )
    } else if (isMarker(cur)) {
      const tail = new Comment(markerIndex)
      insertAfter(cur.parentNode!, tail, cur)
      result.push(new NodePart({ startNode: cur, endNode: tail }))
      walker.nextNode()
      count++
    }
  }
  return result
}

export class Patcher {
  parts: Part[]

  constructor(
    public dof: DocumentFragment,
    public size: number,
    public hash: number
  ) {
    this.parts = createParts(this)
  }

  patch(vals: ReadonlyArray<unknown>) {
    this.parts.forEach((p, i) => p.setValue(vals[i]))
    return this
  }

  appendTo(container: Node, before?: Node) {
    if (before) {
      container.insertBefore(this.dof, before)
    } else {
      container.appendChild(this.dof)
    }
    Reflect.set(this, 'dof', undefined)
  }
}
