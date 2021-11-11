import { html, render } from '@gallop/gallop'
import './index.scss'
import './registry'
// import { createMonaco } from '@real/monaco'
// import code from './monaco?raw'
// import style from './index.scss?inline'

// import prettier from 'https://unpkg.com/prettier@2.3.2/esm/standalone.mjs'

// createMonaco(document.querySelector('#root #ed1')!, { value: code })

// createMonaco(document.querySelector('#root #ed2')!, {
//   value: style,
//   language: 'scss'
// })

render(html`<re-editor></re-editor>`, {
  container: document.querySelector('#root')!
})

export enum BASE_TYPE {
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
  STRING = 'STRING',
  BIGINT = 'BIGINT'
}

export enum ADVANCE_TYPE {
  IMAGE = 'IMAGE'
}

export const BUILTIN_TYPE = { ...BASE_TYPE, ...ADVANCE_TYPE } as const

console.log(Object.values(BUILTIN_TYPE))
console.log(BUILTIN_TYPE)
// console.log(typeof BUILTIN_TYPE.IMAGE)
