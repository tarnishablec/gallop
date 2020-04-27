import { HTMLClip } from './clip'

export function html(strs: TemplateStringsArray, ...vals: unknown[]) {
  return new HTMLClip(strs, vals)
}
