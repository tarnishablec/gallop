import { ShallowClip } from './clip'

export function render(
  shaClip: ShallowClip,
  container: Element | ShadowRoot = document.body,
  before: Node | null = container.firstChild
) {
  const dof = shaClip.createShallowInstance().dof
  container.insertBefore(dof, before)
}
