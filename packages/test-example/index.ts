import {
  html,
  component,
  render,
  createContext,
  useState
} from '@jumoku/jumoku'

let [data, context] = createContext({
  tok: 1,
  children: [2, 4, 6, 8, 7, 10, 0, 22]
})

component('test-a', () => {
  console.log(`a used`)
  return html`
    <div>
      <button @click="${() => {}}">
        aaaa
      </button>
      <hr />
    </div>
  `
})

component('test-b', () => {
  let [state] = useState({ tick: 1 })

  return html`
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

render(html`
  <test-b></test-b>
  <hr />
  <hr />
  <test-b></test-b>
  <style>
    body {
      background: lightgreen;
    }
  </style>
`)
