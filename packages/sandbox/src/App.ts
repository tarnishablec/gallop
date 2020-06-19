import {
  html,
  component,
  render,
  ReactiveElement,
  useState,
  dynamic,
  keepalive,
  useEffect,
  createContext,
  portal,
  repeat,
  useContext
} from '@gallop/gallop'

// import { random } from 'lodash'

import './styles/index.scss'
import { MyCount } from './components/MyCount'
import { TestA } from './components/TestA'

export const [data, context] = createContext({ tick: 1, list: [1, 2, 3] })

const AppRoot = component('app-root', function (this: ReactiveElement) {
  const [state] = useState({ count: 0 })

  useEffect(async () => {
    const s = (this.$root.querySelector('my-count') as ReactiveElement)?.$state
    console.log(s)
  }, [state.count])

  useContext([context])

  return html`
    <div>
      <div>
        <button @click="${() => state.count++}">add count</button>
      </div>
      <slot></slot>
      <hr />
      ${keepalive(
        !(state.count % 2)
          ? MyCount({ color: 'yellow' })
          : dynamic('test-a', { count: state.count })
      )}
      <hr />
      ${portal(html` <div>${state.count}</div> `)}
      <hr />
      ${repeat(
        data.list,
        (v) => v,
        (v) => html` <test-a :count="${v}"></test-a> `
      )}
      <hr />
      <button @click="${() => data.list.unshift(data.list.pop()!)}">
        circle move
      </button>
      <hr />
      ${keepalive(
        state.count % 2
          ? TestA({ count: state.count }).useSlot(html` ${MyCount()} `)
          : null
      )}
      <hr />
    </div>
  `
})

render(html`
  ${AppRoot().useSlot(html` <my-count></my-count> `)}
  <style>
    body {
      background: grey;
      color: white;
    }
  </style>
`)

// window.requestIdleCallback(() => {
//   console.log('ric')
//   // const end = new Date().getTime()
//   // console.log(end - start)
// })
// requestAnimationFrame(() => {
//   console.log('raf')
//   requestAnimationFrame(() => console.log('raf | raf'))
//   setTimeout(() => console.log('raf | set'), 0)
// })
// setTimeout(() => {
//   console.log('set')
//   setTimeout(() => console.log(`set | set`), 0)
//   requestAnimationFrame(() => console.log(`set | raf`))
// }, 0)
// console.log('normal')

// console.log('script start')

// async function async1() {
//   console.log(await 1)
//   await async2()
//   await async3()
//   console.log('async1 end')
// }
// async function async2() {
//   sync4()
//   console.log('async2 end')
//   return await async5()
// }
// async function async3() {
//   console.log('async3 end')
// }

// function sync4() {
//   console.log('sync4 end')
// }

// async function async5() {
//   console.log('async5 end')
// }

// async1()

// requestAnimationFrame(() => {
//   console.log('raf')
// })

// setTimeout(function () {
//   console.log('setTimeout')
// }, 0)

// new Promise((resolve) => {
//   console.log('Promise')
//   resolve()
// })
//   .then(function () {
//     console.log('promise1')
//   })
//   .then(function () {
//     console.log('promise2')
//   })

// console.log('script end')
