import { component, html, portal, useState } from '@gallop/gallop'

export const TestA = component('test-a', ({ count }: { count: number }) => {
  const [state] = useState({ num: 1 })

  return html` <div>test-a:&ensp;${count}</div>
    <div>
      ${portal(html` <div>this is portal ${count}</div>`)}
      <slot></slot>
      <hr />
      test-a in ${state.num}
      <hr />
      <button @click="${() => state.num++}">a button</button>
    </div>`
})
