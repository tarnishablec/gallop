import { TestComponent } from './src/components/TestComponent'
import { html, Render, createContext } from '@jumoku/jumoku'

const props = {
  person: {
    age: 30,
    children: ['allen', 'bob', 'cyla']
  },
  logg: () => alert('hello template')
}

let p = createContext(props)

// setInterval(() => {
//   p.person.age = p.person.age + 1
//   console.log(p.person.age)
// }, 1000)

const temp = html`
  <div>
    haaaaaaaaaaaaa
    <button @click="${() => alert(1)}">+1</button>
    ${TestComponent({ ...props, color: 'blue' })}
  </div>
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

Render(html`
  <test-shadow>
    tragedy
  </test-shadow>
`)
