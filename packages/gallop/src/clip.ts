import { marker, markerIndex } from './marker'
import { Part, AttrPart, PropPart, EventPart, NodePart } from './part'
import { Context } from './context'
import { isMarker } from './is'
import { cleanDofStr, insertAfter } from './dom'
import { UpdatableElement } from './component'
import { NotUpdatableELementError } from './error'
import { DoAble } from './do'

export const range = document.createRange()

/**
 * https://www.measurethat.net/Benchmarks/ShowResult/100437
 * createContextualFragment vs innerHTML
 */
export function createInstance(this: ShallowClip) {
  return new Clip(
    range.createContextualFragment(this.do(getShaHtml)),
    this.vals.length
  )
}

export function getVals(this: ShallowClip) {
  return this.vals
}

export function getShaHtml(this: ShallowClip) {
  return cleanDofStr(this.strs.join(marker))
}

export function getKey(this: ShallowClip) {
  return this.key
}

export class ShallowClip extends DoAble<ShallowClip> {
  protected contexts?: Set<Context<object>>
  protected key?: unknown

  constructor(
    protected readonly strs: TemplateStringsArray,
    protected readonly vals: ReadonlyArray<unknown>
  ) {
    super()
  }

  useKey(key: unknown) {
    this.key = key
    return this
  }
}

export class Clip {
  parts: Part[]
  partCount: number

  dof: DocumentFragment

  constructor(dof: DocumentFragment, partCount: number) {
    this.dof = dof
    this.parts = new Array<Part>()
    this.partCount = partCount
    attachParts(this)
  }

  tryUpdate(vals: ReadonlyArray<unknown>) {
    this.parts.forEach((part, index) => part.setValue(vals[index]))
  }
}

export function attachParts(clip: Clip) {
  const walker = document.createTreeWalker(clip.dof, 133)
  const length = clip.partCount
  let count = 0
  while (count < length) {
    walker.nextNode()
    const cur = walker.currentNode

    if (cur === null) {
      break
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
              if (cur instanceof UpdatableElement) {
                clip.parts.push(
                  new PropPart(count, {
                    node: cur,
                    name: bindName
                  })
                )
              } else {
                throw NotUpdatableELementError(cur.localName)
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
