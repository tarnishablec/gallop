import { html } from '@jumoku/compiler'

const age = 20
const log = () => console.log('hello template')

const template = html`
  <div age="${age}" @click="${log}">
    a test template
  </div>
`
debugger

document.querySelector('#app')?.appendChild(template.cloneNode(true))
