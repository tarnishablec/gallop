import { ShallowClip, createInstance, getVals } from './clip'

export function render(
  shaClip: ShallowClip,
  container: Element | ShadowRoot = document.body,
  before: Node | null = container.firstChild
) {
  const clip = shaClip.do(createInstance)
  clip.tryUpdate(shaClip.do(getVals))
  container.insertBefore(clip.dof, before)
}
