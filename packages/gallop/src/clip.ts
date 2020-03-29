import { marker, markerIndex } from './marker'
import { Part, AttrPart, PropPart, EventPart, NodePart } from './part'
import { Context } from './context'
import { createTreeWalker } from './utils'
import { isMarker } from './is'
import { cleanDofStr, insertAfter } from './dom'
import { UpdatableElement } from './component'
import { NotUpdatableELementError } from './error'
import { DoAble } from './do'

const range = document.createRange()
// https://www.measurethat.net/Benchmarks/ShowResult/100437
// createContextualFragment vs innerHTML

const shallowDofCache = new Map<string, DocumentFragment>()

export function createInstanceFromCache(this: ShallowClip) {
  return new Clip(getShaDofFromCahce.apply(this), this.vals, this.contexts)
}

export function createInstance(this: ShallowClip) {
  return new Clip(
    range.createContextualFragment(this.shaHtml),
    this.vals,
    this.contexts
  )
}

export function getVals(this: ShallowClip) {
  return this.vals
}

export function getShaHtml(this: ShallowClip) {
  return this.shaHtml
}

export function getShaDofFromCahce(this: ShallowClip) {
  const res = (
    shallowDofCache.get(this.shaHtml) ??
    shallowDofCache
      .set(this.shaHtml, range.createContextualFragment(this.shaHtml))
      .get(this.shaHtml)
  )?.cloneNode(true) as DocumentFragment

  window.requestIdleCallback?.(() => {
    //should or not?
    shallowDofCache.clear()
  })
  return res
}

const placeMarkerAndClean = (strs: TemplateStringsArray) =>
  cleanDofStr(strs.join(marker))

export class ShallowClip extends DoAble<ShallowClip> {
  protected readonly shaHtml: string
  protected readonly vals: ReadonlyArray<unknown>
  protected contexts?: Set<Context<object>>

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    super()
    this.vals = vals
    this.shaHtml = placeMarkerAndClean(strs)
  }

  useContext(contexts: Context<object>[]) {
    if (!this.contexts) {
      this.contexts = new Set()
    }
    contexts.forEach((c) => this.contexts!.add(c))
    return this
  }
}

export class Clip {
  parts: Part[] = []
  readonly initVals: ReadonlyArray<unknown>

  dof: DocumentFragment

  contexts?: Set<Context<object>>

  key?: unknown //TODO

  constructor(
    dof: DocumentFragment,
    initVals: ReadonlyArray<unknown>,
    contexts?: Set<Context<object>>
  ) {
    this.dof = dof
    this.initVals = initVals
    this.contexts = contexts
    attachParts(this)
  }

  tryUpdate(vals: ReadonlyArray<unknown>) {
    this.parts.forEach((part, index) => part.setValue(vals[index]))
  }
}

function attachParts(clip: Clip) {
  const walker = createTreeWalker(clip.dof)
  const length = clip.initVals.length
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
