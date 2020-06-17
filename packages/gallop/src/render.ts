import { HTMLClip, createClip, getVals } from './clip'
import { ReactiveElement } from './component'
import { VirtualElement } from './virtual'

export function render(
  view: HTMLClip | VirtualElement,
  container: Element | ShadowRoot = document.body,
  before: Node | null = container.firstChild
) {
  let dof: DocumentFragment | ReactiveElement
  if (view instanceof HTMLClip) {
    dof = view.do(createClip).tryUpdate(view.do(getVals)).dof
  } else {
    dof = view.createInstance()
  }
  container.insertBefore(dof, before)
}
