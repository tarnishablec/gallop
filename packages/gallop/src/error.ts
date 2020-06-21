import { Primitive, Obj, Key } from './utils'

export const LockedProxyError = (target: Obj, prop: Key) =>
  new Error(
    `Can not set new property "${String(
      prop
    )}" to locked object "${JSON.stringify(target)}".`
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
