import { DoAble } from './do'
import { cleanDomStr } from './dom'
import { Patcher } from './patcher'
import { marker } from './marker'
import { hashify } from './utils'

const range = new Range()

export class HTMLClip extends DoAble(Object) {
  [key: string]: unknown
  constructor(
    protected strs: TemplateStringsArray,
    protected vals: ReadonlyArray<unknown>
  ) {
    super()
  }
}

export function getVals(this: HTMLClip) {
  return this.vals
}

export function getShaHtml(this: HTMLClip) {
  return cleanDomStr(this.strs.join(marker))
}

export function createPatcher(this: HTMLClip) {
  const shaHtml = this.do(getShaHtml)
  return new Patcher(
    range.createContextualFragment(shaHtml),
    this.vals.length,
    hashify(shaHtml)
  )
}
