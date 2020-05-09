import { component, html } from '@gallop/gallop'

export const TestE = component(
  'test-e',
  (hide: boolean = true) =>
    hide ? html`<div>true</div>` : html`<span>false</span>`,
  ['hide'],
  { unstable: true }
)
