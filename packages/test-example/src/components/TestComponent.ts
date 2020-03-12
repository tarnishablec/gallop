import { html } from '@jumoku/jumoku'

export const TestChild = (a: number) => html`
  <div style="background-color:red">
    this is test child ${a}
    ${[1, 2, 3].map(
      n => html`
        <h1>${n}</h1>
      `
    )}
  </div>
`
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
        <span style="color:red" light dark>
          Hello Test Template
        </span>
      </h1>
      <button @click="${click}">click</button>
      <span>
        this ${name} is &lt;span&gt; &quot;${name}&quot; :name="${color}"
        ${name} yes
      </span>
      ${name} ${color}
      ${children.map(
        () => html`
          <li>666666</li>
        `
      )}
      ${children.map(
        (c, index) => html`
          ${TestChild(index)}
        `
      )}
      <div>hello</div>
      ${TestChild(5)}
    </div>
  `
}
