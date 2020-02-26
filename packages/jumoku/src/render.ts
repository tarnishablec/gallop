import { FragmentClip } from './fragmentClip'

const appRoot = document.querySelector('#app')!

export const shallowRender = (
  val: FragmentClip,
  location: Element = appRoot
) => {
  location.appendChild(val.shallowDof.cloneNode(true))
}

export const render = () => {}
