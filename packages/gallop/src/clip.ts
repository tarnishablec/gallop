import { marker, markerIndex } from './marker'
import { Part, AttrPart, PropPart, EventPart, NodePart } from './part'
import { isMarker } from './is'
import { cleanDofStr, insertAfter } from './dom'
import { ReactiveElement } from './component'
import { NotReactiveELementError, StyleInTemplateError } from './error'
import { DoAble } from './do'

export const range = document.createRange()

/**
 * https://www.measurethat.net/Benchmarks/ShowResult/100437
 * createContextualFragment vs innerHTML
 */
export function createClip(this: HTMLClip) {
  const shaHtml = this.do(getShaHtml)
  return new Clip(
    range.createContextualFragment(shaHtml),
    shaHtml,
    this.vals.length
  )
}

export function getVals(this: HTMLClip) {
  return this.vals
}

export function getShaHtml(this: HTMLClip) {
  return cleanDofStr(this.strs.join(marker))
}
export class HTMLClip extends DoAble(Object) {
  constructor(
    protected readonly strs: TemplateStringsArray,
    protected readonly vals: ReadonlyArray<unknown>
  ) {
    super()
  }

  useStyle(style: string) {
    this._style = style
    return this
  }
}
export class Clip {
  parts: Part[]
  constructor(
    public dof: DocumentFragment,
    public shaHtml: string,
    public partCount: number
  ) {
    this.dof = dof
    this.parts = new Array<Part>()
    this.partCount = partCount
    attachParts(this)
  }

  tryUpdate(vals: ReadonlyArray<unknown>) {
    this.parts.forEach((part, index) => part.setValue(vals[index]))
    return this
  }
}

export function attachParts(clip: Clip) {
  const walker = document.createTreeWalker(clip.dof, 133)
  const size = clip.partCount
  let count = 0
  while (count < size) {
    walker.nextNode()
    const cur = walker.currentNode

    if (cur === null) {
      break
    }

    if (cur instanceof HTMLStyleElement) {
      throw StyleInTemplateError(cur)
    }

    if (cur instanceof Element) {
      const attrs = cur.attributes
      const { length } = attrs
      for (let i = 0; i < length; i++) {
        const name = attrs[i].name
        const prefix = name[0]
        if (
          prefix === '.' ||
          (prefix === ':' && isMarker(attrs[i].value)) ||
          prefix === '@'
        ) {
          const bindName = name.slice(1)
          switch (prefix) {
            case '.':
              clip.parts.push(
                new AttrPart(count, {
                  node: cur,
                  name: bindName
                })
              )
              break
            case ':':
              if (cur instanceof ReactiveElement) {
                clip.parts.push(
                  new PropPart(count, {
                    node: cur,
                    name: bindName
                  })
                )
              } else {
                throw NotReactiveELementError(cur.localName)
              }
              break
            case '@':
              clip.parts.push(
                new EventPart(count, {
                  node: cur,
                  name: bindName
                })
              )
              break
          }
          // console.log(cur)
          count++
        }
      }
    } else if (cur instanceof Comment) {
      if (cur.data === `{{${markerIndex}}}`) {
        const tail = new Comment(cur.data)
        insertAfter(cur.parentNode!, tail, cur)
        clip.parts.push(
          new NodePart(
            count,
            {
              startNode: cur,
              endNode: tail
            },
            'node'
          )
        )
        count++
        walker.nextNode()
      }
    }
  }
}
