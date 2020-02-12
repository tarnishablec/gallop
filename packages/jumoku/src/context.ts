import { isObject } from './is'
import { createProxy } from './utils'

export type Context = object

export const createContext = <T extends object>(state: T) =>
  createProxy(state, updateComponent)

function updateComponent() {
  console.log('!!!!state changed!!!!')
}
