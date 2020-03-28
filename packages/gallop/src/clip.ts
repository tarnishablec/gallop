import { marker } from './marker'
import { Part } from './part'
import { Context } from './context'

const range = document.createRange()
// https://www.measurethat.net/Benchmarks/ShowResult/100437
// createContextualFragment vs innerHTML

const shallowDofCache = new Map<string, DocumentFragment>()

export class ShallowClip {
  shaHtml: string
  vals: ReadonlyArray<unknown>
  contexts?: Context<object>[]

  constructor(strs: TemplateStringsArray, vals: unknown[]) {
    this.vals = vals
    this.shaHtml = placeMarkerAndClean(strs)
  }

  createInstance() {
    return new Clip(this.getShaDof())
  }

  createShallowInstance() {
    return new Clip(range.createContextualFragment(this.shaHtml))
  }

  getShaDof() {
    const res = (
      shallowDofCache.get(this.shaHtml) ??
      shallowDofCache
        .set(this.shaHtml, range.createContextualFragment(this.shaHtml))
        .get(this.shaHtml)
    )?.cloneNode(true) as DocumentFragment

    window.requestIdleCallback(() => {
      //should ?
      shallowDofCache.clear()
    })

    return res
  }

  useContext(contexts: Context<object>[]) {
    this.contexts = contexts
  }
}

const placeMarkerAndClean = (strs: TemplateStringsArray) =>
  strs
    .join(marker)
    .replace(/(^\s)|(\s$)/, '')
    .replace(/>\s*/g, '>')
    .replace(/\s*</g, '<')
    .replace(/>(\s*?)</g, '><')
    .trim()

export class Clip {
  parts: Part[] = []
  dof: DocumentFragment

  constructor(dof: DocumentFragment) {
    this.dof = dof
  }
}
