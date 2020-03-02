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

  private update() {
    this.watchedInstances.forEach(c => c.update())
  }

  watch(clipInstance: Clip) {
    // console.log(`context watch ${clipInstance.shallowHtml}`)
    this.watchedInstances.add(clipInstance)
  }

  unwatch(clipInstance: Clip) {
    this.watchedInstances.delete(clipInstance)
  }
}

export const createContext = <T extends object>(raw: T) =>
  new Context(raw).proxy

// let [a, context] = createContext({ a: 1 })

