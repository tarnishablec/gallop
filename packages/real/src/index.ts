import { component, html, render, createProxy } from '@gallop/gallop'
import './index.scss'

const foo = createProxy(
  { a: 1 },
  {
    onMut: (target) => {
      console.log(target)
    }
  }
)
const bar = createProxy(foo, {
  onMut: (target) => {
    console.log(target)
  }
})

component('re-dropdown', function () {
  return html`
    <div>
      <button
        @click="${() => {
          bar.a++
          console.log(bar)
        }}"
      >
        bar ++
      </button>
    </div>
  `
})

render(html` <re-dropdown></re-dropdown> `)
