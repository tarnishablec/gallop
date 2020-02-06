import { Component } from './component'
import { isObject } from './is'

export type Context = object

export function createProxy<T extends object>(raw: T): T {
  return new Proxy(raw, {
    set: (target, prop, val, reciver) => {
      console.log('!!!!state changed!!!!')
      return Reflect.set(target, prop, val, reciver)
    },
    get: (target, prop, reciver) => {
      const res = Reflect.get(target, prop, reciver)
      return isObject(res) ? createProxy(res) : res
    }
  })
}

function updateComponent(component: Component) {}

export const createContext = createProxy
