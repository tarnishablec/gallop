import { ShallowClip } from './clip'

export function html(strs: TemplateStringsArray, ...vals: unknown[]) {
  return new ShallowClip(strs, vals)
}
