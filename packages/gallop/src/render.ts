import { HTMLClip } from './clip'
import { NodePart } from './part'

/**
 * @returns ununmout function
 */
export function render(
  view: HTMLClip,
  {
    container = document.body,
    before = container.firstChild
  }: { container?: Node; before?: Node | null } = {}
) {
  const part = NodePart.create()
  part.setValue(view)
  part.moveInto(container, before)
  return () => part.destroy()
}
