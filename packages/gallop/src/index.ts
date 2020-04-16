import { createProxy } from './reactive'

export { html } from './parse'
export { render } from './render'
export {
  component,
  UpdatableElement,
  VirtualElement,
  resolveCurrentHandle,
  setCurrentHandle
} from './component'
export { createContext, Context } from './context'
export { useState, useEffect, useContext } from './hooks'
export { DoAble } from './do'
export { DynamicComponent } from './dynamic'
export { isProxy, isMarker } from './is'

export type { Component, Complex } from './component'
export type { ReturnOf, ParamsOf } from './do'
export type { Effect } from './hooks'

// const a = { a: { b: 1 } }
// const p = createProxy(a)
// const aa = p.a
// console.log(aa)
// const aaa = p.a
// console.log(aaa)
// console.log(aaa === aa)  //true
