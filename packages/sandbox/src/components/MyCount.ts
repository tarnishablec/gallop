import { component, html, useState, dynamic } from '@gallop/gallop'

export const MyCount = component('my-count', () => {
  const [state] = useState({ count: 0 })
  return html`
    <button @click="${() => state.count--}">
      -
    </button>
    <span>${state.count}</span>
    <button @click="${() => state.count++}">
      +
    </button>

    ${dynamic(state.count % 2 ? 'test-a' : 'test-b', { count: 20 })}
    <style>
      * {
        font-size: 200%;
      }

      span {
        width: 4rem;
        display: inline-block;
        text-align: center;
      }

      button {
        width: 64px;
        height: 64px;
        border: none;
        border-radius: 10px;
        background-color: seagreen;
        color: white;
      }
    </style>
  `
})
