import { createProxy } from './reactive'
import { StateCanNotUseError } from './error'
import { resolveCurrentHandle } from './component'
import { isUpdatableElement } from './is'

export const useState = <T extends object>(initValue: T): [T] => {
  let current = resolveCurrentHandle()
  if (isUpdatableElement(current)) {
    if (!current.$state) {
      return [
        (current.$state = createProxy(initValue, () => current.enupdateQueue()))
      ]
    } else {
      return [current.$state] as [T]
    }
  }
  throw StateCanNotUseError
}

export function useRef(element?: Element) {
  let current = resolveCurrentHandle()
  return [element, current]
}
