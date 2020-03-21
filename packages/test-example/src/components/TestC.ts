import { component, html } from '@gallop/gallop'

component('test-c', (age: number) => {
  return html`
    <span>test-c ${age}</span>
  `
})
