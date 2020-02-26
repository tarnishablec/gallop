import { TestTemplate } from './src/components/TestComponent'
import { shallowRender, createProxy } from '@jumoku/jumoku'

const prop = {
  name: 'Chen Yihan',
  children: ['alice', 'bob', 'celina'],
  color: 'red',
  click: () => nnn()
}

function nnn() {
  alert(1)
}

const clip = TestTemplate(prop)
// console.log(clip.rawHtml)

const walker = document.createTreeWalker(clip.getShaDof(), 133)

// console.log(walker.currentNode)

while (walker.nextNode()) {
  let cur = walker.currentNode
  console.log(cur.nodeName)
}

console.log(clip.shallowDof)
shallowRender(clip)

// import { html, LitElement, property, customElement } from 'lit-element'

// class TestTest extends LitElement {
//   @property() message = 'hi'

//   firstUpdated() {
//     let s = setInterval(() => {
//       this.message = this.message += 'i'
//     }, 1000)
//     setTimeout(() => {
//       clearInterval(s)
//     }, 6000)
//   }

//   render() {
//     debugger
//     const { message } = this
//     let res = html`
//       <div message="${message}">
//         ${message + 'iiii'}
//       </div>
//     `
//     return res
//   }
// }

// customElements.define('test-test', TestTest)

// document.querySelector('#app')?.appendChild(
//   document
//     .createRange()
//     .createContextualFragment(`<test-test>`)
//     .cloneNode(true)
// )

const testA = ({ name }: { name: string }) => alert(name)
console.log(testA)
import { get } from 'lodash'

function aaa(prop: { name: string; person: { age: number } }) {
  console.log(get(prop, 'prop.person.age'))
}

const a = {} as { name: string; person: { age: number } }

aaa(a)
