import {
  html,
  component,
  render,
  createContext,
  useState,
  useEffect,
  UpdatableElement
} from '@gallop/gallop'

import './src/components/TestA'
import { TestC } from './src/components/TestC'
import { TestD } from './src/components/TestD'

setTimeout(() => {
  import(/* webpackChunkName: "test-b" */ './src/components/TestB')
}, 5050)

export let [data, context] = createContext({ tick: 1, list: [1, 2, 3] })

component('app-root', function (this: UpdatableElement) {
  let [state] = useState({ tok: 1, color: 'red', countdown: 5 })
  useEffect(() => {
    console.log(`app-root effect mounted`)
    const interval = setInterval(() => {
      if (state.countdown <= 0) {
        clearInterval(interval)
      } else {
        state.countdown--
      }
    }, 1000)
  }, [])

  useEffect(() => {
    console.log(`app-root effect updated`)
  })

  useEffect(() => {
    console.log(`app-root color state updated`)
  }, [state.color])

  useEffect(() => {
    console.log(`app-root tok state updated`)
    console.dir(this.$root)
  }, [state.tok])

  return html`
    <div>this is app-root</div>
    <button @click="${() => data.tick++}">context tick +1</button>
    <div>Context: &zwnj;${data.tick}</div>
    <hr />
    <button @click="${() => state.tok++}">state tok +1</button>
    <div>State: &zwnj;${state.tok}</div>
    <hr />
    ${TestC(state.countdown.toString())}
    <hr />
    <button
      @click="${() => (state.color = state.color === 'red' ? 'green' : 'red')}"
    >
      change color
    </button>
    <hr />
    ${state.countdown ? html` <span>${state.countdown}</span> ` : null}
    <test-b></test-b>
    <hr />
    <slot>
      slot default content
    </slot>
    <hr />
    <dyna-mic :is="${data.tick % 2 ? 'test-a' : 'test-b'}" :color="${'orange'}">
      <div slot="aslot">
        a - slot${data.tick}
      </div>
    </dyna-mic>
    <hr />
    <div>
      ${data.list.map((n) =>
        n % 2
          ? html` <button @click="${() => console.log(n)}">${n}</button> `
          : 2
      )}
    </div>
    <button @click="${() => data.list.push(data.list.length - 1)}">
      add into list
    </button>
    <hr />
    ${TestD(TestC, state.countdown)}
    <hr />
  `.useContext([context])
})

render(
  html`
    <app-root>
      this is slot
    </app-root>
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
