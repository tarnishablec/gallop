import { ShallowClip } from './clip'

const appRoot = document.querySelector('#app')!

export const render = (
  shaClip: ShallowClip,
  container: Element = appRoot,
  before?: Node
) => {
  let dof = shaClip.getShaDof()
  container.insertBefore(dof, before ?? null)
}
