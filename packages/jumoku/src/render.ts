import { FragmentClip } from './fragmentClip'

const appRoot = document.querySelector('#app')!

export const shallowRender = (
  clip: FragmentClip,
  location: Element = appRoot
) => {
  location.appendChild(clip.shallowDof)
}

export const render = () => {}
