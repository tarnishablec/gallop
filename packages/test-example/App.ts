import { html, component, render } from '@gallop/gallop'

const test = (a: number) => html`
  <div .style="${a}">
    ${a} haha ${a}
    <span>hello</span>
  </div>
  ${[1, 2, 3].map((a) => (a % 2 ? html` <div>${a}</div> ` : a))}
  <span>asdas</span>
`

component('test-test', test)

render(html` <test-test></test-test> `)

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
