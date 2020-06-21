import { HTMLClip, createPatcher, getVals } from './clip'
import { insertAfter } from './dom'

export function render(
  view: HTMLClip,
  {
    container = document.body,
    after = container.lastChild
  }: { container?: Node; after?: Node | null } = {}
) {
  const dof = view.do(createPatcher).tryUpdate(view.do(getVals)).dof
  insertAfter(container, dof, after)
}
