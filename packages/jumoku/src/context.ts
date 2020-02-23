import { ClipInstance } from './clipInstance'
import { createProxy } from './reactive'

export class Context<T extends object> {
  raw: T
  proxy: [T, Context<T>]
  watchedInstances: Set<ClipInstance> = new Set()

  constructor(raw: T) {
    this.raw = raw
    this.proxy = [createProxy(raw, () => this.update()), this]
  }

  private update() {
    this.watchedInstances.forEach(c => c.update())
  }

  watch(clipInstance: ClipInstance) {
    this.watchedInstances.add(clipInstance)
  }

  unwatch(clipInstance: ClipInstance) {
    this.watchedInstances.delete(clipInstance)
  }
}

export const createContext = <T extends object>(raw: T) =>
  new Context(raw).proxy

// let [a, context] = createContext({ a: 1 })
