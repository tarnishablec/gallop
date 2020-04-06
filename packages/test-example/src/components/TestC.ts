import { component, html } from '@gallop/gallop/src'

export const TestC = component(
  'test-c',
  (name: string) =>
    html`<div>this is test-c</div>
      <div><div>${name}</div></div>`
)
