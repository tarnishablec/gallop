import { FragmentClip, FlagMaps } from './parse'
import { Context } from './context'

export type Component = (
  props: any,
  options?: Options,
  context?: Context
) => FragmentClip

export type ComponentRenderer = (
  clip: FragmentClip,
  flagMaps: FlagMaps
) => FragmentClip

// export const componentRenderer: ComponentRenderer = (
//   clip,
//   flagMaps
// ): FragmentClip => {

//   return
// }

type Options = {
  slot?: string
}

export function createShadow(name: string, clip: FragmentClip) {
  customElements.define(
    name,
    class Shadow extends HTMLElement {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' }).appendChild(
          clip.fragment.cloneNode(true)
        )
      }
    }
  )
}
