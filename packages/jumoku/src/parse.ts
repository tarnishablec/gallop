import { FragmentClip } from './fragmentClip'

export function html(
  strs: TemplateStringsArray,
  ...vals: unknown[]
): FragmentClip {
  return new FragmentClip(strs, vals)
}
