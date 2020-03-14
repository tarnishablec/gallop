import { html, component, render } from '@jumoku/jumoku'
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
      person: { color: 'yellow', age: 12 }
    }
  ) => html`
    <div>
      <span>
        <strong style="color:red;font-size:1.3rem">
          this is test-a
        </strong>
      </span>
      <div style="color:deepgreen">${name}</div>
      <div>${age}</div>
      <span .style="${`color:${person.color}`}">66666</span>
      <slot></slot>
    </div>
  `
)
const testFunc = (a: number, b: number) => console.log(a + b)

component(
  'test-b',
  (
    {
      age,
      color,
      names,
      children
    }: { age: number; color: string; names?: string; children: string[] } = {
      age: 1,
      color: 'purple',
      names: 'ppp',
      children: ['alice', 'bob', 'celina']
    }
  ) => {
    // let [] = useState({tick:1})

    return html`
      <div
        class="test-b-header"
        style="background-color:red"
        .style="${`color:${color}`}"
      >
        test-b age:${age}
      </div>
      <div>With key list diff</div>
      ${children.map(c =>
        html`
          <li>${c}</li>
        `.useKey(c)
      )}
      <test-a :name="${names}" :age="${age}">
        <button
          @click.once="${(e: Event) => {
            testFunc(age, age)
            console.log(e)
          }}"
        >
          <slot></slot>
        </button>
      </test-a>
      ${TestTemplate(prop)}
    `
  }
)

render(html`
  <test-b>click once</test-b>
  <style>
    body {
      background: lightgreen;
    }
  </style>
`)

let testB = document.querySelector('test-b')!

let ppp = (testB as any).$props

let intv = setInterval(() => {
  ppp.age += 1
  ppp.children.unshift(`ppp${Date.now()}`)
}, 1000)

setTimeout(() => {
  clearInterval(intv)
}, 5000)
