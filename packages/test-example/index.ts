import { html, component, createContext, render } from '@jumoku/jumoku'
import './src/components/Lit'
import { TestTemplate } from './src/components/TestComponent'

const prop = {
  name: 'Chen Yihan',
  children: ['alice', 'bob', 'celina'],
  color: 'red',
  click: () => alert(1)
}

component(
  'test-a',
  (
    {
      name,
      age,
      person
    }: { name: string; age: number; person: { color: string; age: number } } = {
      name: 'yoho',
      age: 12,
      person: { color: 'red', age: 12 }
    }
  ) => html`
    <div>
      <span>
        <strong style="color:red;font-size:1.3rem">
          this is test-a
        </strong>
      </span>
      <span style="color:green">${name}</span>
      <span>${age}</span>
      <span .style="${`color:${person.color}`}">66666</span>
      <slot></slot>
    </div>
  `
)

const [data, context] = createContext({ a: 1 })

component(
  'test-b',
  (
    { age, name }: { age: number; name: string } = { age: 1, name: 'bbbbbb' }
  ) => {
    return html`
      <test-a :name="${name}" :age="${age}">
        asd
      </test-a>
      <test-a :name="${name}" :age="${age}">
        asd
      </test-a>
    `
  }
)

render(html`
  <test-b></test-b>
`)

// setInterval(() => {
//   data.age += 1
// }, 2000)
