import { FragmentClip, FlagMaps } from './parse'
import { Context } from './context'
import { createProxy } from './utils'
import { isFragmentClip } from './is'

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

export function createShadow(name: string, clip: FragmentClip): void
export function createShadow(
  name: string,
  clipBuilder: () => FragmentClip
): void
export function createShadow(
  name: string,
  clipOrBuilder: FragmentClip | (() => FragmentClip)
) {
  customElements.define(
    name,
    class Shadow extends HTMLElement {
      constructor() {
        super()
        if (isFragmentClip(clipOrBuilder)) {
          this.attachShadow({ mode: 'open' }).appendChild(
            clipOrBuilder.fragment.cloneNode(true)
          )
        } else {
        }
      }
    }
  )
}
