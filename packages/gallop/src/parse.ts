import { HTMLClip } from './clip'

export function html(strs: TemplateStringsArray, ...vals: unknown[]) {
  return new HTMLClip(strs, vals)
}

export function css(strs: TemplateStringsArray, ...vals: string[]) {
  return
}
