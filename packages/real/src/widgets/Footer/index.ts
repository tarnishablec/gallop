import { html, useStyle } from '@gallop/gallop'
import style from './index.scss?inline'

export const Footer = () => {
  useStyle(() => style, [])

  return html`<div class="footer-root"></div>`
}
