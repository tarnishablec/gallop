import {
  html,
  component,
  render,
  createContext,
  useState
} from '@gallop/gallop'

import { TestA } from './src/components/TestA'

TestA()

export let [data, context] = createContext({ tick: 1 })

component(
  'app-root',
  () => {
    let [state] = useState({ tok: 1 })

    return html`
      <div>this is app-root</div>
      <button @click="${() => data.tick++}">tick +1</button>
      <div>${data.tick}</div>
      <hr />
      <button @click="${() => state.tok++}">tok +1</button>
      <div>${state.tok}</div>
      <hr />
      <test-a :name="aaa"></test-a>
    `.useContext([context])
  },
  false
)

render(
  html`
    <app-root :a="2"></app-root>
    <style>
      body {
        background: grey;
        color: white;
      }
    </style>
  `
)

// function testTask() {
//   window.requestIdleCallback(() => console.log('requestIdleCallback'))
//   setTimeout(() => console.log('setTimeout'), 0)
//   Promise.resolve(
//     setTimeout(() => {
//       console.log('promise')
//     }, 0)
//   )
//   requestAnimationFrame(() => console.log('requestAnimationFrame'))
//   console.log('normal')
// }

// testTask()
