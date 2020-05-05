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
  useCache,
  useMemo
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
  hide: true,
  person: { age: 1, height: 180 }
})

component('app-root', function (this: ReactiveElement) {
  let [state] = useState({ tok: 1, color: 'red', countdown: 0, count: 0 })

  const [memo] = useMemo(() => {
    console.log('computed')
    return { res: state.tok * 2 }
  })

  useContext([context])

  let [cache] = useCache({ val: 'val' })

  useEffect(() => {
    console.log(`app-root effect mounted`)
    console.log(cache.val)
    // setInterval(() => {
    //   state.countdown++
    // }, 1000)
  }, [])

  useEffect(() => {
    console.log(memo)
  }, [memo])

  useEffect(() => {
    console.log(`app-root color state updated`)
  }, [state.color])

  return html`
    <div>this is app-root</div>
    <button @click="${() => data.tick++}">context tick +1</button>
    <div>Context: &zwnj;${data.tick}</div>
    <hr />
    <button @click="${() => state.tok++ && state.count++}">state tok +1</button>
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
      @click="${() =>
        data.list.push((data.list[data.list.length - 1] ?? -1) + 1)}"
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
          ${1}
        </div>
      `}"
    ></test-f>
    <hr />
    <div>${memo}</div>
    <hr />
  `.useStyle('a')
})

render(
  html`
    <app-root :a :b="''">
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
//   window.requestIdleCallback(() => console.log('ric'))
//   requestAnimationFrame(() => {
//     console.log('raf')
//     requestAnimationFrame(() => console.log('raf in raf'))
//     setTimeout(() => console.log('set in raf'), 0)
//   })
//   setTimeout(() => {
//     console.log('set')
//     setTimeout(() => console.log(`set in set`), 0)
//     requestAnimationFrame(() => console.log(`raf in set`))
//   }, 0)
//   console.log('normal')
// }

// testTask()
