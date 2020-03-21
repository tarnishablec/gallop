import { ShallowClip } from './clip'

export const html = (strs: TemplateStringsArray, ...vals: unknown[]) =>
  new ShallowClip(strs, vals)

export const css = (strs: TemplateStringsArray, ...vals: string[]) =>
  new StyleClip(strs, vals)

export class StyleClip {
  style: string

  constructor(strs: TemplateStringsArray, vals: string[]) {
    this.style = strs
      .reduce((acc, cur, index) => `${acc}${cur}${vals[index] ?? ''}`, '')
      .trim()
  }
}
