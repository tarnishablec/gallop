import { LitElement, html, customElement, property } from 'lit-element'

@customElement('test-lit')
export class TestLit extends LitElement {
  @property() age = 1
  @property() color = 'green'

  render() {
    return html`
      <button
        @click=${() => {
          debugger
          this.age += 1
          this.color = this.color === 'red' ? 'green' : 'red'
        }}
      >
        click
      </button>
      <div>${testComp(this.age, this.color)}</div>
      <div>this is age ${this.age} !</div>
    `
  }
}

const testComp = (num: number, color: string) => html`
  <span style="color:${color}">${num}</span>
`
