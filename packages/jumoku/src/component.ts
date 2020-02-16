function component(
  name: string,
  initialState: any,
  builder: (...args: unknown[]) => DocumentFragment
) {
  customElements.define(
    name,
    class Shadow extends HTMLElement {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' }).appendChild(builder(initialState))
      }
    }
  )
}
