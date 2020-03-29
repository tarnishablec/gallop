import {
  html,
  component,
  render,
  createContext,
  useState,
  useEffect,
  UpdatableElement
} from '@gallop/gallop'

import { TestA } from './src/components/TestA'

TestA()

setTimeout(() => {
  import('./src/components/TestB').then(({ TestB }) => {
    // async component
    TestB()
  })
}, 5050)

export let [data, context] = createContext({ tick: 1 })

component(
  'app-root',
  () => {
    let [state] = useState({ tok: 1, color: 'red', countdown: 5 })
    useEffect(() => {
      console.log(`app-root effect mounted`)
      const interval = setInterval(() => {
        state.countdown--
        if (state.countdown <= 0) {
          clearInterval(interval)
        }
      }, 1000)
    }, [])

    useEffect(() => {
      console.log(`app-root effect updated`)
    })

    useEffect(() => {
      console.log(`app-root color state updated`)
    }, [state.color])

    useEffect(
      function (this: UpdatableElement) {
        console.log(`app-root tok state updated`)
        console.dir(this.$root)
      },
      [state.tok]
    )

    return html`
      <div>this is app-root</div>
      <button @click="${() => data.tick++}">context tick +1</button>
      <div>Context: &zwnj;${data.tick}</div>
      <hr />
      <button @click="${() => state.tok++}">state tok +1</button>
      <div>State: &zwnj;${state.tok}</div>
      <hr />
      <test-a :color="${state.color}"></test-a>
      <button
        @click="${() =>
          (state.color = state.color === 'red' ? 'green' : 'red')}"
      >
        change color
      </button>
      <hr />
      ${state.countdown ? html` <span>${state.countdown}</span> ` : null}
      <test-b></test-b>
    `.useContext([context])
  },
  false
)

render(
  html`
    <app-root></app-root>
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
