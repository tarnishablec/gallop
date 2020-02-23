import { BaseComponent } from './baseComponent'
import { FragmentClip } from './fragmentClip'
import { getPropNamesFromFunction } from './utils'

const componentPool = new WeakMap<TemplateStringsArray, FragmentClip>()

type Props = Record<string, any>

type Component = {}

export function component(
  name: string,
  builder: (props: Props) => FragmentClip
) {
  const propNames = getPropNamesFromFunction(builder)
  customElements.define(
    name,
    class extends BaseComponent {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' })
      }

      created(): void {
        throw new Error('Method not implemented.')
      }
      mounted(): void {
        throw new Error('Method not implemented.')
      }

      static get observedAttributes() {
        return ['a']
      }

      connectedCallback() {}

      disconnectedCallback() {}

      adoptedCallback() {}

      attributeChangedCallback() {}
    }
  )
}
