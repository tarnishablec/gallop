import { component, html, useEffect } from '@gallop/gallop'

export const TestB = () =>
  component(
    'test-b',
    () => {
      useEffect(() => {
        console.log(`test-b mounted`)
      }, [])
      return html`
        <div>
          <div>this is test-b</div>
        </div>
      `
    },
    false
  )
