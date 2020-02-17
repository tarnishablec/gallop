import { TestTemplate } from './src/components/TestComponent'
import { render } from '@jumoku/jumoku'

const prop = {
  name: 'Chen Yihan',
  children: ['alice', 'bob', 'celina'],
  color: 'red',
  click: () => nnn()
}

function nnn() {
  alert(1)
}

debugger

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
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())
console.log(walker.nextNode())

render(TestTemplate(prop))

// import { html, LitElement, property } from 'lit-element'

// const name = 'nnn'

// const lit = html`
//   <div .name="${name}">
//     ${name.split('').forEach(
//       n => html`
//         <li>${n}</li>
//       `
//     )}
//   </div>
// `

// class TestTest extends LitElement {
//   @property() message = 'hi'

//   firstUpdated() {
//     let s = setInterval(() => {
//       this.message = this.message += 'i'
//     }, 1000)
//     setTimeout(() => {
//       clearInterval(s)
//     },6000)
//   }

//   render() {
//     const { message } = this
//     let res = html`
//       <div message="${message}">
//         ${message + 'iiii'}
//       </div>
//     `
//     console.log(res.getHTML())
//     console.log(res.getTemplateElement())
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
