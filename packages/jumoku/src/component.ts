import { BaseComponent } from './baseComponent'
import { FragmentClip } from './fragmentClip'

const componentPool = new WeakMap<TemplateStringsArray, FragmentClip>()

type Props = Record<string, any>

type Component = {}

export function component(
  name: string,
  builder: (porps: Props) => FragmentClip
) {
  customElements.define(
    name,
    class extends BaseComponent {
      created(): void {
        throw new Error('Method not implemented.')
      }
      mounted(): void {
        throw new Error('Method not implemented.')
      }

      static get observedAttributes() {
        return []
      }

      connectedCallback() {}

      disconnectedCallback() {}

      adoptedCallback() {}

      attributeChangedCallback() {}

      constructor() {
        super()
        this.attachShadow({ mode: 'open' })
      }
    }
  )
}
