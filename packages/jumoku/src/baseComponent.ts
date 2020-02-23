export abstract class BaseComponent extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  abstract created(): void

  abstract mounted(): void

  update() {}
}
