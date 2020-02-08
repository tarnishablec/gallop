import { isObject } from './is'

export type Context = object

const createProxy = <T extends object>(raw: T, sideEffect: Function): T => {
  return new Proxy(raw, {
    set: (target, prop, val, reciver) => {
      sideEffect()
      return Reflect.set(target, prop, val, reciver)
    },
    get: (target, prop, reciver) => {
      const res = Reflect.get(target, prop, reciver)
      return isObject(res) ? createProxy(res, sideEffect) : res
    }
  })
}

export const createContext = <T extends object>(state: T) =>
  createProxy(state, updateComponent)

function updateComponent() {
  console.log('!!!!state changed!!!!')
}
