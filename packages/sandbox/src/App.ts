import {
  html,
  component,
  render,
  ReactiveElement,
  useState,
  dynamic,
  keepalive,
  useEffect,
  suspense,
  getShaHtml
} from '@gallop/gallop'

// import { random } from 'lodash'

import './styles/index.scss'
import { MyCount } from './components/MyCount'
import { TestA } from './components/TestA'

component('app-root', function (this: ReactiveElement) {
  const [state] = useState({ count: 0 })

  useEffect(async () => {
    const s = (this.$root.querySelector('my-count') as ReactiveElement)?.$state
    console.log(s)
  }, [state.count])

  return html`
    <div>
      <test-a :count="${state.count}"></test-a>
      ${TestA({ count: state.count + 1 })}
      ${dynamic('test-a', { count: state.count + 2 })}
      <div>
        <button @click="${() => state.count++}">add count</button>
      </div>
      <hr />
      ${keepalive(!(state.count % 2) ? MyCount() : 666)}
      <hr />
      ${suspense(
        async () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          await new Promise((res, rej) => {
            setTimeout(() => {
              // rej()
              res()
            }, 1000)
          })
          // await import('./components/MyCount')
          return html`<my-count :color="white"></my-count>`
        },
        {
          pending: html`<div>Loading</div>`,
          fallback: html`<div>Error</div>`
        }
      )}
      <hr />
    </div>
  `
})

const template = html`
  <app-root> </app-root>
  <style>
    body {
      background: grey;
      color: white;
    }
  </style>
`

render(template)

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
