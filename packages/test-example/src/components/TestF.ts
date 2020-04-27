import { component, html, HTMLClip } from '@gallop/gallop'

export const TestF = component(
  'test-f',
  (clip: HTMLClip) => html`
    <div>
      ${clip}
    </div>
  `
)
