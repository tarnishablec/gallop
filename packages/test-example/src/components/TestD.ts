import { component, html, Complex } from '@gallop/gallop'

export const TestD = component(
  'test-d',
  <T extends Complex>(component: T, ...args: Parameters<T>) => html`
    <div>this is test-d hoc</div>
    <div>${component(...args)}</div>
  `
)
