import { createProxy } from './reactive'
import { Clip } from './clip'

export class Context<T extends object> {
  raw: T
  proxy: [T, Context<T>]
  watchedInstances: Set<Clip> = new Set()

  constructor(raw: T) {
    this.raw = raw
    this.proxy = [createProxy(raw, () => this.update()), this]
  }

  watch(clip: Clip) {
    this.watchedInstances.add(clip)
  }

  unwatch(clip: Clip) {
    this.watchedInstances.delete(clip)
  }

  private update() {
    this.watchedInstances.forEach(clip => {
      // console.log(clip)
      let elementInstance = clip.elementInstance!
      setTimeout(() => {
        clip.update(elementInstance.builder(elementInstance.$props).vals)
      }, 0)
    })
  }
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
