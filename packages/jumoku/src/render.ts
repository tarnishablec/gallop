import { FragmentClip } from './parse'

const AppRoot = document.querySelector(`#app`)!

export function Render(root: FragmentClip) {
  AppRoot.appendChild(root.fragment)
}
