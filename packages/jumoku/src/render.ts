import { ShallowClip } from './clip'

export const render = (
  shaClip: ShallowClip,
  container: Element = document.body,
  before: Node | null = container === document.body
    ? document.querySelector('noscript#tail')!
    : null
) => {
  let clip = shaClip._createShallowInstance()
  clip.init()
  container.insertBefore(clip.dof, before)
}
