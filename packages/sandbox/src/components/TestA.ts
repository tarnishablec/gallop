import { component, html, portal } from '@gallop/gallop'

export const TestA = component('test-a', ({ count }: { count: number }) => {
  return html` <div>test-a:&ensp;${count}</div>
    <div>${portal(html` <div>this is portal ${count}</div>`)}</div>`
})
