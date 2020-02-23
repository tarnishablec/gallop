export abstract class BaseComponent extends HTMLElement {
  static get observedAttributes() {
    return new Array<string>()
  }
}
