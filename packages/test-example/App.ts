import {
  html,
  component,
  render,
  createContext,
  useState,
  useEffect,
  UpdatableElement,
  useContext,
  repeat
} from '@gallop/gallop'

import { diff } from '@egjs/list-differ'

console.log(diff([1, 2, 3, 4, 5, 6], [5, 6, 2, 1, 3, 5, 7]))

import './src/components/TestA'
import { TestC } from './src/components/TestC'
import { TestD } from './src/components/TestD'
import './src/components/TestE'

import './src/styles/index.scss'

setTimeout(() => {
  import(/* webpackChunkName: "test-b" */ './src/components/TestB')
}, 5050)

export let [data, context] = createContext({
  tick: 1,
  list: [11, 22, 33],
  hide: true
})

component('app-root', function(this: UpdatableElement) {
  let [state] = useState({ tok: 1, color: 'red', countdown: 5 })

  useContext([context])

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
      part="changecolorbutton"
      @click="${() => (state.color = state.color === 'red' ? 'green' : 'red')}"
    >
      change color
    </button>
    <hr />
    ${state.countdown
      ? html`
          <span>${state.countdown}</span>
        `
      : null}
    <test-b></test-b>
    <hr />
    <slot>
      slot default content
    </slot>
    <hr />
    <dyna-mic
      :is="${data.tick % 2 ? 'test-a' : 'test-b'}"
      :color="${state.color}"
    >
      <div slot="aslot">
        a - slot${data.tick}
      </div>
    </dyna-mic>
    <hr />
    <div>
      ${data.list.map(val =>
        [...val.toString()].map(
          v =>
            html`
              <button>${v}</button>
            `
        )
      )}
    </div>
    <hr />
    <div>
      ${data.list.map(val =>
        [...val.toString()].map((v, index) =>
          index % 2 ? TestC(v.toString()) : { a: { b: index } }
        )
      )}
    </div>
    <hr />
    <div>
      ${repeat(
        data.list,
        item => item,
        item =>
          [...item.toString()].map(
            v =>
              html`
                <button @click="${() => console.log(item)}">${v}</button>
              `
          )
      )}
    </div>
    <hr />
    <button
      @click="${() => {
        data.list.unshift(data.list.pop()!)
      }}"
    >
      circle move
    </button>
    <hr />
    <button
      @click="${() => data.list.push(data.list[data.list.length - 1] + 11)}"
    >
      add into list
    </button>
    <hr />
    ${TestD(TestC, state.countdown)}
    <hr />
    <button @click="${() => (data.hide = !data.hide)}">change e</button>
    <test-e :hide="${data.hide}"></test-e>
    <hr />
  `
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
// window.requestIdleCallback(() => console.log('requestIdleCallback'))
// Promise.resolve(
//   setTimeout(() => {
//     console.log('promise')
//   }, 0)
// )
// requestAnimationFrame(()=>console.log('raf'))
// requestAnimationFrame(() =>
//   requestAnimationFrame(() => console.log('requestAnimationFrame'))
// )
// console.log(Promise.resolve(1))
// setTimeout(() => console.log('setTimeout'), 0)
// console.log('normal')
// }

// testTask()
