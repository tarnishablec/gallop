import { ShallowClip } from './clip'

const appRoot = document.querySelector('#app')!

const appContainer = document.createDocumentFragment()

export const shallowRender = (clip: ShallowClip, container: Node = appContainer) => {
  if (container instanceof ShadowRoot) {
    container.appendChild(clip.createInstance().dof)
  } else {
    container.appendChild(clip.getShaDof())
  }
}

export const render = (clip: ShallowClip, location: Node = appContainer) => {
  shallowRender(clip, location)
  appRoot.appendChild(appContainer)
}
