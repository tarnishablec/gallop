import { ShallowClip } from './clip'

export const html = (strs: TemplateStringsArray, ...vals: unknown[]) =>
  new ShallowClip(strs, vals)
