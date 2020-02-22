import { html } from '@jumoku/jumoku'

const TestChild = (a: number) => html`
  <div>
    this is test child ${a}
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
}) => html`
  <div>
    <h1>
      <span :color="${color}" style="color:red" light dark="" :name="${name}">
        Hello Test Template
      </span>
    </h1>
    <button @click="${click}">click</button>
    <span>
      this ${name} is &lt;span&gt; &quot;${name}&quot; :name="${color}" ${name}
      yes
    </span>
    ${name} ${color}
    ${children.map(
      c => html`
        <li>666${c}666</li>
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
