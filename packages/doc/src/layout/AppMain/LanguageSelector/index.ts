import { component, html, useStyle, css } from '@gallop/gallop'
import raw from './index.scss?raw'

component('language-selector', () => {
  useStyle(
    () => css`
      ${raw}
    `,
    []
  )

  return html`<div></div>`
})
