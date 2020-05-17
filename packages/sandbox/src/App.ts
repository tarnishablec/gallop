import {
  html,
  component,
  render,
  ReactiveElement,
  repeat,
  useEffect,
  useState,
  useMemo,
  suspense,
  portal
} from '@gallop/gallop'

import './styles/index.scss'

const TestA = component(
  'test-a',
  (count: number = 22) => {
    const [state] = useState({
      arr: new Array(count).fill(void 0).map((v, i) => i)
    })

    useMemo(
      () => (state.arr = new Array(count).fill(void 0).map((v, i) => i)),
      [count]
    )

    // debugger
    console.log('test-a')
    useEffect(() => {
      console.log('test-a mounted')
    }, [])

    return html`
      <div>
        this is test-a
        <div>
          <button
            @click="${() => {
              console.log('button clicked')
              state.arr.unshift(state.arr.pop()!)
            }}"
          >
            circle move
          </button>
        </div>
        ${repeat(
          state.arr,
          (v) => v,
          (v) => html` <test-b>${v}</test-b>`
        )}
      </div>
    `
  },
  { propList: ['count'] }
)

component('test-b', () => {
  useEffect(() => {
    console.log(`test-b mounted`)
    return () => console.log(`test-b unmounted`)
  }, [])
  return html` <div>this is test-b <slot></slot></div> `
})

component('app-root', function (this: ReactiveElement) {
  console.log('app-root')
  // let [state] = useState<{ count: number; page: 'count' | 'main' }>({
  //   count: 500,
  //   page: 'count'
  // })

  let [state] = useState({ portalCount: 0 })

  useEffect(() => {
    const input = this.$root.querySelector('input')
    console.log(input)
    input?.addEventListener('change', (e) => {
      console.log(e.target)
    })
  }, [])

  return html`
    <div>
      <div class="main-title"></div>
      <hr />
      ${TestA()}
      <hr />
      <div>
        ${suspense(
          async () => (await import('./components/MyCount')).MyCount('red'),
          { pending: 1 }
        )}
      </div>
      <hr />
      <div>
        hello
        <button @click="${() => state.portalCount++}">add portal count</button>
        ${portal(
          html`<div>${state.portalCount}</div>`,
          document.querySelector('body')!
        )}
      </div>
      <hr />
      <div>
        ${repeat(
          new Array(10).fill(void 0).map((v, i) => i),
          (v) => v,
          (v) => html` <div>this is ${v}</div>`
        )}
      </div>
    </div>
    <style>
      input {
        display: block;
      }

      .main-title > div {
        display: grid;
        place-items: center;
      }
    </style>
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
