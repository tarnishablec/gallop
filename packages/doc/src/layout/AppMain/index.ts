import { component, html, useEffect } from '@gallop/gallop'

component('app-main', () => {
  useEffect(() => {}, [])

  return html` <div>
      <mark-down :filename="test.md"></mark-down>
    </div>
    <style>
      :host {
        padding: 0 3rem;
      }
    </style>`
})
