import { FragmentClip } from './fragmentClip'

export function html(
  strs: TemplateStringsArray,
  ...vals: unknown[]
): FragmentClip {
  let clip = new FragmentClip(strs, vals)
  return clip
}
