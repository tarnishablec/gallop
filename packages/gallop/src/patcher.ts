import { Part, AttrPart, PropPart, EventPart, NodePart } from './part'
import { StyleInTemplateError } from './error'
import { marker, markerIndex } from './marker'
import { insertAfter } from './dom'

function createParts(patcher: Patcher) {
  const result: Part[] = []
  const { dof, size } = patcher
  const walker = document.createTreeWalker(dof)
  let count = 0
  while (count < size) {
    walker.nextNode()
    const { currentNode: cur } = walker

    if (cur === null) {
      break
    }

    if (cur instanceof HTMLStyleElement) {
      throw StyleInTemplateError(cur)
    }

    if (cur instanceof Element) {
      const { attributes: attrs } = cur
      const { length } = attrs

      for (let i = 0; i < length; i++) {
        const { name } = attrs[i]
        const prefix = name[0]
        if (
          prefix === '.' ||
          prefix === '@' ||
          (prefix === ':' && attrs[i].value !== marker)
        ) {
          const bindName = name.slice(1)
          switch (prefix) {
            case '.':
              result.push(new AttrPart({ node: cur, name: bindName }))
              break
            case ':':
              result.push(new PropPart({ node: cur, name: bindName }))
              break
            case '@':
              result.push(new EventPart({ node: cur, name: bindName }))
              break
          }
          count++
        }
      }
    } else if (cur instanceof Comment) {
      if (markerIndex === cur.data) {
        const tail = new Comment(marker)
        insertAfter(cur.parentNode!, tail, cur)
        result.push(new NodePart({ startNode: cur, endNode: tail }))
        count++
      }
    }
  }
  return result
}

export class Patcher {
  parts: Part[]

  constructor(public dof: DocumentFragment, public size: number) {
    this.parts = createParts(this)
  }

  tryUpdate(vals: ReadonlyArray<unknown>) {
    this.parts.forEach((p, i) => p.setValue(vals[i]))
    return this
  }
}
