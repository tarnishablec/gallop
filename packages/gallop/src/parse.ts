import { HTMLClip } from './clip'

export function html(strs: TemplateStringsArray, ...vals: unknown[]) {
  return new HTMLClip(strs, vals)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function css(strs: TemplateStringsArray, ...vals: string[]) {
  return strs
    .reduce((acc, cur, index) => `${acc}${cur}${vals[index] ?? ''}`, '')
    .trim()
}
