import { html } from '@gallop/gallop'
import './index.scss?inline'

export const Dock = () => {
  return html` <div>
    <slot></slot>
  </div>`
}
