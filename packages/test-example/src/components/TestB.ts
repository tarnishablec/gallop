import { createContext, component, useState, html } from '@jumoku/jumoku'
import './TestA'

export let [data, context] = createContext({
  tok: 1,
  children: [2, 4, 6, 8, 7, 10, 0, 22]
})

component('test-b', ({ name }: { name: string } = { name: 'yihan' }) => {
  let [state] = useState({ tick: 1 })

  return html`
    <div>${name}</div>
    <test-a></test-a>
    <hr />
    <hr />
    <div>
      <button
        @click="${() => {
          state.tick += 1
        }}"
      >
        component state add 1
      </button>
      <div>${state.tick}</div>
      <hr />
      <button
        @click="${() => {
          data.tok += 1
        }}"
      >
        context add 1
      </button>
      <div>${data.tok}</div>
    </div>
  `.useContext([context])
})
