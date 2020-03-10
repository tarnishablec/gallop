import { html, component, render, useState } from '@jumoku/jumoku'
import './src/components/Lit'
import { TestTemplate, TestChild } from './src/components/TestComponent'

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
      <div style="color:lightgreen">${name}</div>
      <div>${age}</div>
      <span .style="${`color:${person.color}`}">66666</span>
      <slot></slot>
    </div>
  `
)

component(
  'test-b',
  (
    { age, color, names }: { age: number; color: string; names?: string } = {
      age: 1,
      color: 'green',
      names: 'ppp'
    }
  ) => {
    let [] = useState({tick:1})

    return html`
      <div class="test-b-header">test-b</div>
      <test-a :name="${names}" :age="${age}" a>
        <button @click="${(e: Event) => console.log(e)}">
          <slot></slot>
        </button>
      </test-a>
      ${TestTemplate(prop)}
    `
  }
)

render(html`
  <test-b>click</test-b>
`)

// setInterval(() => {
//   data.age += 1
// }, 2000)
