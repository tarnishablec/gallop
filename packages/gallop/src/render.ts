import { ShallowClip } from './clip'

export function render(
  shaClip: ShallowClip,
  container: Element | ShadowRoot = document.body,
  before: Node | null = container.firstChild
) {
  const dof = shaClip.createInstance().dof
  container.insertBefore(dof, before)
}
