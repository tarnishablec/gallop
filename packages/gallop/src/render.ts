import { HTMLClip, createPatcher, getVals } from './clip'

export function render(
  view: HTMLClip,
  {
    container = document.body,
    before = container.firstChild
  }: { container?: Node; before?: Node | null } = {}
) {
  const patcher = view.do(createPatcher).tryUpdate(view.do(getVals))
  const dof = patcher.dof
  container.insertBefore(dof, before)
  return patcher
}
