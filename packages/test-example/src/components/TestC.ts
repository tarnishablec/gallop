import { component, html } from '@gallop/gallop/src'

export const TestC = component(
  'test-c',
  (name: string, age: number) =>
    html`<div>${name}</div>
      <div>${age}</div>`
)
