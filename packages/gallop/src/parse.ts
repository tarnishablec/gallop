import { HTMLClip } from './clip'

export function html(strs: TemplateStringsArray, ...vals: unknown[]) {
  return new HTMLClip(strs, vals)
}

interface StyleTagger {}

export const style = {
  css: (strs: TemplateStringsArray, ...vals: unknown[]) => strs.join('')
}
