import { component, html } from '@gallop/gallop'

export const TestA = component('test-a', ({ count }: { count: number }) => {
  return html` <div>test-a:&ensp;${count}</div>`
})
