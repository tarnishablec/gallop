import { html, component, render } from '@gallop/gallop'

const test = (a: number) => html`
  <div .style="${a}" style="color:red">
    ${a} haha ${a}
    <span>hello</span>
  </div>
  ${[1, 2, 3].map((a) => (a % 2 ? html` <div>${a}</div> ` : a))}
  <span>asdas</span>
  <button @click.once="${() => alert(1)}">Click</button>
`

component('test-test', test, false)

render(html` <test-test :a="2"></test-test> `)

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
