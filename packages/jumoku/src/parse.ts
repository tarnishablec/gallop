import { Clip } from './clip'

export const html = (strs: TemplateStringsArray, ...vals: unknown[]) =>
  new Clip(strs, vals)
