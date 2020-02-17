import { FragmentClip } from './fragmentClip'

export function html(
  strs: TemplateStringsArray,
  ...vals: unknown[]
): DocumentFragment {
  let clip = new FragmentClip(strs, vals)
  return clip.getTemplate().content
}
