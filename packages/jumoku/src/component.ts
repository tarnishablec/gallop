import { FragmentClip, FlagMaps } from './parse'
import { Context } from './context'
import { createProxy } from './utils'

export const componentPool: {
  [key: string]: Component
} = createProxy({}, (target, prop, val) => createShadow(prop as string, val))

export type Component = (
  props: any,
  options?: Options,
  context?: Context
) => FragmentClip

type Options = {
  slot?: string
}

export const createShadow = (name: string, clip: FragmentClip) => {
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
