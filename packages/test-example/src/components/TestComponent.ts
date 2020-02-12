import { html, Component } from '@jumoku/jumoku'

type Prop = {
  person: {
    age: number
    children: any[]
  }
  logg: Function
  [key: string]: any
}

export const vue: any = {}

export const TestComponent: Component = (vue.test = ({
  person,
  logg,
  color
}: Prop) => html`
  <div @click="${logg}">
    <span>a test template ${person.age + 1}</span>
    <slot :style="color: ${color}">
      <p>this is default</p>
    </slot>
    ${person.children.map(
      c => html`
        <div>${c}</div>
      `
    )}
    ${person.children.map(
      () => html`
        <div>static</div>
      `
    )}
    ${TestTwo(2)}
  </div>
`)

const TestTwo = (a: number) => html`
  <div>${a}</div>
`
