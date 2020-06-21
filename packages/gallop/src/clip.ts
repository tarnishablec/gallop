import { DoAble } from './do'
import { cleanDomStr } from './dom'
import { Patcher } from './patcher'
import { marker } from './marker'

const range = new Range()

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
  return new Patcher(
    range.createContextualFragment(this.do(getShaHtml)),
    this.vals.length
  )
}
