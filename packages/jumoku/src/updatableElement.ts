import { createProxy, Proxyed } from './reactive'

export abstract class UpdatableElement<P extends object> extends HTMLElement {
  $props: Proxyed<P>
  constructor(prop: P) {
    super()
    this.$props = createProxy(prop, () => this.update())
  }

  update() {}
}
