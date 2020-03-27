import { marker } from './marker'
import { Part } from './part'

const range = document.createRange()
// https://www.measurethat.net/Benchmarks/ShowResult/100437
// createContextualFragment vs innerHTML

const shallowDofCache = new Map<string, DocumentFragment>()

export class ShallowClip {
  shaHtml: string

  constructor(strs: TemplateStringsArray) {
    this.shaHtml = placeMarker(strs)
  }

  createInstance() {}

  useContext() {}
}

const placeMarker = (strs: TemplateStringsArray) =>
  strs
    .join(marker)
    .replace(/(^\s)|(\s$)/, '')
    .replace(/>\s*/g, '>')
    .replace(/\s*</g, '<')
    .replace(/>(\s*?)</g, '><')
    .trim()

export class Clip {
  parts: Part[] = []
}
