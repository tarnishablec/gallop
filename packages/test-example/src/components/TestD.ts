import { component, html, Complex } from '@gallop/gallop/src'

export const TestD = component(
  'test-d',
  (component: Complex, ...args: any[]) => html`
    <div>this is test-d hoc</div>
    <div>${component(...args)}</div>
  `
)
