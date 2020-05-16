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

component(
  'test-a',
  (count: number) => {
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
      <div>
        ${suspense(
          async () => (await import('./components/MyCount')).default('red'),
          html`<div>Loading</div>`,
          html`<div>Error</div>`
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
        <div>
          ${state.portalCount}
        </div>
      </div>
      <hr />
      <div>
        ${repeat(
          new Array(5000).fill(void 0).map((v, i) => i),
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

// function testTask() {
//   window.requestIdleCallback(() => {
//     console.log('ric')
//     // const end = new Date().getTime()
//     // console.log(end - start)
//   })
//   requestAnimationFrame(() => {
//     console.log('raf')
//     requestAnimationFrame(() => console.log('raf | raf'))
//     setTimeout(() => console.log('raf | set'), 0)
//   })
//   setTimeout(() => {
//     console.log('set')
//     setTimeout(() => console.log(`set | set`), 0)
//     requestAnimationFrame(() => console.log(`set | raf`))
//   }, 0)
//   console.log('normal')
// }

// testTask()
