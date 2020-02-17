import { BaseComponent } from './baseComponent'

function component(
  name: string,
  initialState: any,
  builder: (...args: unknown[]) => DocumentFragment
) {
  customElements.define(
    name,
    class extends BaseComponent {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' }).appendChild(builder(initialState))
      }
    }
  )
}
