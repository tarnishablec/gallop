import { component, html } from '@jumoku/jumoku'

component(
  'test-c',
  (age: number) => html`
    <div>test-c ${age}</div>
  `
)
