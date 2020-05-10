import { html, component, render, ReactiveElement } from '@gallop/gallop'
import { routerView } from '@gallop/router'

import './src/styles/index.scss'

export default component('app-root', function(this: ReactiveElement) {
  return html`
    <div>this is app-root</div>
    <div>${routerView()}</div>
  `
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
