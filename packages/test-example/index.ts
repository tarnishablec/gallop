import { html, component, createContext, render } from '@jumoku/jumoku'

import { TestTemplate } from './src/components/TestComponent'

component(
  'test-a',
  (
    {
      name,
      age,
      person
    }: { name: string; age: number; person: { name: string; age: number } } = {
      name: 'yoho',
      age: 12,
      person: { name: 'uuu', age: 12 }
    }
  ) => html`
    <div>
      <span><strong style="color:red">this is test-a</strong></span>
      <span style="color:green">${name}</span>
      <span>${age}</span>
      <slot></slot>
      <span>${person.name}</span>
    </div>
  `
)

component(
  'test-b',
  (
    { age, name }: { age: number; name: string } = { age: 1, name: 'bbbbbb' }
  ) => {
    const [data, context] = createContext({ a: 1 })
    return html`
      <test-a :name="${name}" :age="${age}">
        <slot></slot>
      </test-a>
    `.use(context)
  }
)

const prop = {
  name: 'Chen Yihan',
  children: ['alice', 'bob', 'celina'],
  color: 'red',
  click: () => alert(1)
}

render(TestTemplate(prop))
