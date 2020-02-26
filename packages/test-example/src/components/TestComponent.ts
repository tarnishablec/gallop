import { html, createContext } from '@jumoku/jumoku'

const TestChild = (a: number) => html`
  <div>
    this is test child ${a}
  </div>
`

const [data, context] = createContext({ sex: 'boy' })

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
}) =>
  html`
    <div>
      <h1>
        <span :color="${color}" style="color:red" light dark="" :name="${name}">
          Hello Test Template ${data.sex}
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
    .use(context)
    .use(context)
