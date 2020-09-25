import { Part, AttrPart, PropPart, EventPart, NodePart, BoolPart } from './part'
import { StyleInTemplateError } from './error'
import { marker, markerIndex, isMarker } from './marker'
import { insertAfter } from './dom'
import { keysOf } from './utils'

export type SyntaxMap = {
  [k: string]: new ({ node, name }: { node: Element; name: string }) => Part
}

export const rawAttrSyntaxMap: SyntaxMap = {
  '.': AttrPart,
  ':': PropPart,
  '@': EventPart,
  '?': BoolPart
}

let mergedSyntaxMap = rawAttrSyntaxMap

export const mergeSyntax = (syntaxMap: SyntaxMap) => {
  mergedSyntaxMap = { ...mergedSyntaxMap, ...syntaxMap }
}

/**
 * CreateTreeWalker vs createNodeIterator
 *
 * Https://jsperf.com/getcomments/6
 */
function createParts(patcher: Patcher) {
  const result: Part[] = []
  const { dof, size } = patcher
  const walker = document.createTreeWalker(dof, 133)
  let count = 0
  const syntaxKeys = keysOf(mergedSyntaxMap)
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
          syntaxKeys.includes(prefix) &&
          (prefix !== ':' || attrs[i].value === marker)
        ) {
          const name = n.slice(1)
          result.push(new mergedSyntaxMap[prefix]({ node: cur, name }))
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
    const temp = [...this.parts].reverse()
    temp.forEach((p, i) => p.setValue(vals[vals.length - 1 - i]))
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
