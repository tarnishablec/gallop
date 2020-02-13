import { TestComponent, vue } from './src/components/TestComponent'
import { html, Render, createContext, createShadow } from '@jumoku/jumoku'

const props = {
  person: {
    age: 30,
    children: ['allen', 'bob', 'cyla']
  },
  logg: () => alert('hello template')
}

let p = createContext(props)

createShadow(
  'test-shadow',
  html`
    <div>
      haaaaaaaaaaaaa
      <button @click="${() => alert(1)}">+1</button>
      ${TestComponent({ ...props, color: 'blue' })}
    </div>
  `
)

createShadow('test-comp', TestComponent({ ...p, color: 'blue' }))

Render(html`
  <test-shadow>
    tragedy
    <test-comp></test-comp>
  </test-shadow>
`)
console.log(createContext(vue))
