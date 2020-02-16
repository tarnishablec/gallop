import { TestTemplate } from './src/components/TestComponent'
import { render, marker } from '@jumoku/jumoku'

const prop = {
  name: 'Chen Yihan',
  children: ['alice', 'bob', 'celina'],
  color: 'red',
  click: () => nnn()
}

function nnn() {
  alert(1)
}

const walker = document.createTreeWalker(TestTemplate(prop), 133)

console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())

render(TestTemplate(prop))

import { html } from 'lit-element'

const name = 'nnn'

debugger

const lit = html`
  <div .name="${name}">
    ${name.split('').forEach(
      n => html`
        <li>${n}</li>
      `
    )}
  </div>
`

console.log(lit.getHTML())

console.log(lit.getTemplateElement())
