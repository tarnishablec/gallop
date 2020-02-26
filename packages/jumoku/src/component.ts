import { BaseComponent } from './baseComponent'
import { FragmentClip } from './fragmentClip'
import { getPropNamesFromFunction } from './utils'
import { get } from 'lodash'

const componentPool = new WeakMap<TemplateStringsArray, FragmentClip>()

export type Props = Record<string, any>

type Component = {}

export function component<P>(
  name: string,
  builder: (props: P) => FragmentClip
) {
  const propNames = getPropNamesFromFunction(builder)
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
        return propNames
      }

      connectedCallback() {}

      disconnectedCallback() {}

      adoptedCallback() {}

      attributeChangedCallback() {}
    }
  )
}
