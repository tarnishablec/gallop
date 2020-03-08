import { createProxy, Proxyed } from './reactive'

export class Context<T extends object> {
  raw: T
  proxy: [Proxyed<T>, Context<T>]

  constructor(raw: T) {
    this.raw = raw
    this.proxy = [createProxy(raw, () => this.update()), this]
  }

  private update() {}
}

export const createContext = <T extends object>(raw: T) =>
  new Context(raw).proxy

// let [a, context] = createContext({ a: 1 })

export const useState = <T extends object>(initValue: T) => {
  return initValue as T
}

export class State<T extends object> {
  initValue: T

  constructor(val: T) {
    this.initValue = val
  }
}

export class StateFactory<T extends object> {
  initValue: T

  constructor(val: T) {
    this.initValue = val
  }
}
