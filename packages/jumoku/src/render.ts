import { ShallowClip } from './clip'

export const render = (
  shaClip: ShallowClip,
  container: Element = document.body,
  before: Node = document.querySelector('noscript#tail')!
) => {
  let clip = shaClip._createShallowInstance()
  clip.init()
  container.insertBefore(clip.dof, before ?? null)
}
