import { html, createContext } from '@jumoku/jumoku'

const TestChild = (a: number) => html`
  <div>
    this is test child ${a}
  </div>
`
export const [data, context] = createContext({ age: 1 })

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
        <span
          color="${color}"
          style="color:red"
          width="${1}"
          light
          dark=""
          name="${name}"
        >
          Hello Test Template ${data.age}
        </span>
      </h1>
      <button @click="${click}">click</button>
      <slot name="default"></slot>
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
