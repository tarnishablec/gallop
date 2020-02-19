'use strict'

import { html } from '../src'

// describe('parse', () => {
//   describe('html tagged tamplate', () => {
//     test('no val template', () => {
//       const div = document.createElement('div')
//       const span = document.createElement('span')
//       div.appendChild(new Text('hello'))
//       span.appendChild(new Text('world'))
//       div.appendChild(span)
//       const frag = document.createDocumentFragment()
//       frag.appendChild(div)
//       expect(
//         html`
//           <div>
//             hello
//             <span>world</span>
//           </div>
//         `.getTemplate().content
//       ).toBe(frag.textContent)
//     })
//     test('val template', () => {
//       const temp = html`
//         <div>
//           Hello
//           <slot name="ok"></slot>
//         </div>
//       `
//     })
//   })
// })
