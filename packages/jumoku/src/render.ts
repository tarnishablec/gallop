import { ShallowClip } from './clip'

export const render = (
  shaClip: ShallowClip,
  container: Element = document.body,
  before: Node = document.querySelector('noscript#tail')!
) => {
  let dof = shaClip.createShallowInstance()
  container.insertBefore(dof, before ?? null)
}
