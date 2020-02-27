import { BaseComponent } from './baseComponent'
import { FragmentClip } from './fragmentClip'
import { getPropsFromFunction } from './utils'

const componentPool = new WeakMap<TemplateStringsArray, FragmentClip>()

export type Props = Record<string, any>

type Component = {}

export function component<P>(
  name: string,
  builder: (props: P) => FragmentClip
) {
  let { propsNames, defaultValue } = getPropsFromFunction(builder)
  customElements.define(
    name,
    class extends BaseComponent {
      constructor() {
        super()
        let shaDof = builder(defaultValue).shallowDof
        this.attachShadow({ mode: 'open' }).appendChild(shaDof.cloneNode(true))
      }

      static get observedAttributes() {
        return propsNames
      }

      connectedCallback() {}

      disconnectedCallback() {}

      adoptedCallback() {}

      attributeChangedCallback() {}
    }
  )
}
