import { marker, markerIndex } from './marker'
import { Part, AttrPart, PropPart, EventPart, NodePart } from './part'
import { Context } from './context'
import { createTreeWalker } from './utils'
import { isMarker } from './is'
import { cleanDofStr, insertAfter } from './dom'
import { UpdatableElement } from './component'
import { NotUpdatableELementError } from './error'

const range = document.createRange()
// https://www.measurethat.net/Benchmarks/ShowResult/100437
// createContextualFragment vs innerHTML

const shallowDofCache = new Map<string, DocumentFragment>()

export class ShallowClip {
  shaHtml: string
  vals: ReadonlyArray<unknown>
  contexts?: Set<Context<object>>

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.vals = vals
    this.shaHtml = placeMarkerAndClean(strs)
  }

  createInstanceFromCache() {
    return new Clip(this.getShaDof(), this.vals)
  }

  createInstance() {
    return new Clip(range.createContextualFragment(this.shaHtml), this.vals)
  }

  getShaDof() {
    const res = (
      shallowDofCache.get(this.shaHtml) ??
      shallowDofCache
        .set(this.shaHtml, range.createContextualFragment(this.shaHtml))
        .get(this.shaHtml)
    )?.cloneNode(true) as DocumentFragment

    window.requestIdleCallback(() => {
      //should or not?
      shallowDofCache.clear()
    })

    return res
  }

  useContext(contexts: Context<object>[]) {
    if (!this.contexts) {
      this.contexts = new Set()
    }
    contexts.forEach((c) => this.contexts!.add(c))
    return this
  }
}

const placeMarkerAndClean = (strs: TemplateStringsArray) =>
  cleanDofStr(strs.join(marker))

export class Clip {
  parts: Part[] = []
  dof: DocumentFragment
  initVals: ReadonlyArray<unknown>

  constructor(dof: DocumentFragment, initVals: ReadonlyArray<unknown>) {
    this.dof = dof
    this.initVals = initVals

    this.attachParts()
  }

  attachParts() {
    const walker = createTreeWalker(this.dof)
    const length = this.initVals.length
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
                this.parts.push(
                  new AttrPart(
                    count,
                    this.initVals[count],
                    {
                      node: cur,
                      name: bindName
                    },
                    'attr'
                  )
                )
                break
              case ':':
                if (cur instanceof UpdatableElement) {
                  this.parts.push(
                    new PropPart(
                      count,
                      this.initVals[count],
                      {
                        node: cur,
                        name: bindName
                      },
                      'prop'
                    )
                  )
                } else {
                  throw NotUpdatableELementError(cur.localName)
                }
                break
              case '@':
                this.parts.push(
                  new EventPart(
                    count,
                    this.initVals[count],
                    {
                      node: cur,
                      name: bindName
                    },
                    'event'
                  )
                )
                break
            }
            // console.log(cur)
            count++
          }
        }
      } else if (cur instanceof Comment) {
        if (cur.data === `{{${markerIndex}}}`) {
          const tail = new Comment(`{{${markerIndex}}}`)
          insertAfter(cur.parentNode!, tail, cur)
          this.parts.push(
            new NodePart(
              count,
              this.initVals[count],
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
}
