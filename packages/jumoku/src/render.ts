import { Clip } from './clip'

const appRoot = document.querySelector('#app')!

const appContainer = document.createDocumentFragment()

export const shallowRender = (clip: Clip, container: Node = appContainer) => {
  if (container instanceof ShadowRoot) {
    container.appendChild(clip.getShaDof().cloneNode(true))
  } else {
    container.appendChild(clip.getShaDof())
  }

  clip.parts.forEach((p, index) => {
    p.setValue(clip.vals[index])
    p.commit()
  })
}

export const render = (clip: Clip, location: Node = appContainer) => {
  shallowRender(clip, location)
  appRoot.appendChild(appContainer)
}
