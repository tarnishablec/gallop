import {
  html,
  component,
  render,
  createContext,
  useState,
  useEffect,
  ReactiveElement,
  useContext,
  repeat,
  useCache
} from '@gallop/gallop'

import './src/components/TestA'
import { TestC } from './src/components/TestC'
import { TestD } from './src/components/TestD'
import './src/components/TestF'
import './src/components/TestE'

import './src/styles/index.scss'

export let [data, context] = createContext({
  tick: 1,
  list: new Array(10).fill(void 0).map((v, i) => i),
  hide: true
})

component('app-root', function (this: ReactiveElement) {
  let [state] = useState({ tok: 1, color: 'red', countdown: 0 })

  useContext([context])

  let [cache] = useCache({ val: 1 })

  useEffect(() => {
    console.log(`app-root effect mounted`)
    console.log(cache.val)
    setInterval(() => {
      state.countdown++
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
      ${repeat(
        data.list, //list need to be render
        (item) => item, //key diff callback to generate key
        (
          item //actually render
        ) =>
          html`
            <button @click="${() => console.log(item)}">
              ${item + `a${state.countdown}`}
            </button>
          `
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
    <button @click="${() => data.list.shift()}">
      remove first
    </button>
    <hr />
    ${TestD(TestC, state.countdown)}
    <hr />
    <button @click="${() => (data.hide = !data.hide)}">change e</button>
    <test-e :hide="${data.hide}"></test-e>
    <hr />
    <test-f
      :clip="${html`
        <div>
          ${repeat(
            data.list,
            (e) => e,
            (e) => e
          )}
        </div>
      `}"
    ></test-f>
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

function testTask() {
  window.requestIdleCallback(() => console.log('requestIdleCallback'))
  Promise.resolve(
    setTimeout(() => {
      console.log('promise')
    }, 0)
  )
  requestAnimationFrame(() => console.log('raf'))
  requestAnimationFrame(() => {
    console.log('requestAnimationFrame')
    requestAnimationFrame(() => console.log('requestAnimationFrameFrame'))
  })
  console.log(Promise.resolve(1))
  setTimeout(() => console.log('setTimeout'), 0)
  console.log('normal')
}

testTask()
