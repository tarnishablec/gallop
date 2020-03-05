import { ShallowClip, Clip } from './clip'
import { Part } from './part'

const appRoot = document.querySelector('#app')!

let rootClip: Clip

export const render = (shaClip: ShallowClip, container: Node = appRoot) => {
  let clip = shaClip.createInstance()
  rootClip = clip
  container.appendChild(clip.dof)

  clip.update(shaClip.vals)
}
