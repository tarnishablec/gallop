import { ShallowClip } from './clip'

const appRoot = document.querySelector('#app')!

export let firstRender = true

export const render = (shaClip: ShallowClip, container: Node = appRoot) => {
  let clip = shaClip.createInstance()
  container.appendChild(clip.dof)

  clip.init()
}
