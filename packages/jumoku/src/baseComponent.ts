export abstract class BaseComponent extends HTMLElement {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return []
  }

  abstract created(): void

  abstract mounted(): void

  update() {}
}
