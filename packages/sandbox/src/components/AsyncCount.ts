import { component, html, useState } from '@gallop/gallop'

export const AsyncCount = component('async-count', () => {
  const [state] = useState({ count: 0 })

  return html` <div>
    <p>You clicked ${state.count} times.</p>
    <button @click="${() => state.count++}">Click me</button>
    <button
      @click="${() =>
        setTimeout(() => {
          alert('Value: ' + state.count)
        }, 3000)}"
    >
      Show me the value in 3 seconds
    </button>
  </div>`
})
