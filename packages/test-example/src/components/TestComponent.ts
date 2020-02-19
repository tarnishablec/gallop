import { html } from '@jumoku/jumoku'

export const TestTemplate = ({
  name,
  children,
  color,
  click
}: {
  name: string
  children: string[]
  color: string
  click: Function
}) => {
  return html`
    <div>
      <h1>
        <span :color="${color}">Hello Test Template</span>
      </h1>
      <button @click="${click}">click</button>
      <span>${name}</span>
      ${children.map(
        c => html`
          <li>${c}</li>
        `
      )}
      ${children.map(
        (c, index) => html`
          ${TestChild(index)}
        `
      )}
    </div>
  `
}

const TestChild = (a: number) => html`
  <div>
    this is test child ${a}
  </div>
`
