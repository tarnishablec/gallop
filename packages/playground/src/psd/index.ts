import { render, LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { readPsd } from 'ag-psd'

@customElement('psd-app')
export class App extends LitElement {
  override render() {
    return html` <input
      type="file"
      @input="${async (e: InputEvent) => {
        const { files } = e.target as HTMLInputElement
        const file = files?.[0]
        if (file) {
          const psd = readPsd(await file.arrayBuffer(), {
            logMissingFeatures: true,
            logDevFeatures: true
          })
          console.log(psd)
        }
      }}"
    />`
  }
}

render(html`<psd-app />`, document.body)
