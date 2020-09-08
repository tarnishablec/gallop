import { DoAble } from './do'
import { cleanDomStr, createFragment } from './dom'
import { Patcher } from './patcher'
import { marker } from './marker'
import { hashify } from './utils'

export class HTMLClip extends DoAble(Object) {
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
    createFragment(shaHtml),
    this.vals.length,
    hashify(shaHtml)
  )
}
