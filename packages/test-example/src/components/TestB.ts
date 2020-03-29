import { component, html } from '@gallop/gallop'

export const TestB = () =>
  component(
    'test-b',
    () =>
      html`
        <div>
          <div>this is test-b</div>
        </div>
      `
  )
