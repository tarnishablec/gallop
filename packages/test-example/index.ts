import { TestComponent } from './src/components/TestComponent'
import { html } from '@jumoku/jumoku'

const props = {
  person: {
    age: 30,
    children: ['allen', 'bob', 'cyla']
  },
  logg: () => alert('hello template')
}

const temp = html`
  <div>
    haaaaaaaaaaaaa
    <button @click="${() => alert(1)}">+1</button>
    ${TestComponent({ ...props })}
  </div>
`

const aaa = (a: number) => html`
  <span>jjjjj${a}jjjjj</span>
`

class TestShadow extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).appendChild(
      temp.fragment.cloneNode(true)
    )
  }
}

customElements.define('test-shadow', TestShadow)

document.querySelector('#app')?.appendChild(
  html`
    <test-shadow>
      ${aaa(1)}
    </test-shadow>
  `.fragment
)
