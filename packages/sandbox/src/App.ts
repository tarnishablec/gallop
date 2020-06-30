import {
  html,
  render,
  component,
  Context,
  useEffect,
  useState,
  ReactiveElement
} from '@gallop/gallop'

export const [global, globalContext] = Context.initGlobal({ data: 1 })

component('test-app', function (this: ReactiveElement) {
  const [state] = useState({ tick: 0, children: [1, 2, 3] })

  useEffect(() => {
    console.log(state.tick)
    return () => console.log(state.tick + '!!!')
  }, [state.tick])

  useEffect(() => {
    console.log(`state.tick`)
  }, [])

  useEffect(() => {
    console.log(this.$root.querySelector('button'))
  })

  console.log(`test-app`)

  return html`
    <div>
      test-app
      <button
        @click="${() => {
          for (let i = 0; i < 100; i++) {
            state.tick++
          }
          state.children.push(2)
        }}"
      >
        add
      </button>
    </div>
  `
})

render(html` <test-app></test-app> `)

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
