import { Primitive } from './utils'

export const LockedProxyError = (target: object) =>
  new Error(
    `Can not set new property to locked object "${JSON.stringify(target)}".`
  )

export const NotReactiveELementError = (name: string) =>
  new SyntaxError(`${name} element is not an Reactive Element`)

export const DirectivePartTypeError = (name: string) =>
  new SyntaxError(`${name} directive type error`)

export const DuplicatedKeyError = (key: Primitive) =>
  new Error(`Key ${String(key)} is Duplicated`)

export const StyleInTemplateError = (el: HTMLStyleElement) =>
  new SyntaxError(
    `Can not put dynamic part inside or after ${el}, try using useStyle() instead.`
  )
