import { Clip } from './clip'

const appRoot = document.querySelector('#app')!

export const shallowRender = (
  clip: Clip,
  location: Element = appRoot
) => {
  location.appendChild(clip.shallowDof)
}

export const render = () => {}
