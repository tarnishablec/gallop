import { BaseComponent } from './baseComponent'
import { FragmentClip } from './fragmentClip'
import { getPropsFromFunction } from './utils'
import { get } from 'lodash'

const componentPool = new WeakMap<TemplateStringsArray, FragmentClip>()

export type Props = Record<string, any>

type Component = {}

export function component<P>(
  name: string,
  builder: (props: P) => FragmentClip
) {
  // const propNames = getPropsFromFunction(builder).props
  customElements.define(
    name,
    class extends BaseComponent {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        let a = {} as P
        builder(a)
      }

      static get observedAttributes() {
        return []
      }

      connectedCallback() {}

      disconnectedCallback() {}

      adoptedCallback() {}

      attributeChangedCallback() {}
    }
  )
}
