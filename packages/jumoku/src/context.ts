import { createProxy } from './reactive'
import { FragmentClip } from './fragmentClip'

export class Context<T extends object> {
  raw: T
  proxy: [T, Context<T>]
  watchedInstances: Set<FragmentClip> = new Set()

  constructor(raw: T) {
    this.raw = raw
    this.proxy = [createProxy(raw, () => this.update()), this]
  }

  private update() {
    this.watchedInstances.forEach(c => c.update())
  }

  watch(clipInstance: FragmentClip) {
    this.watchedInstances.add(clipInstance)
  }

  unwatch(clipInstance: FragmentClip) {
    this.watchedInstances.delete(clipInstance)
  }
}

export const createContext = <T extends object>(raw: T) =>
  new Context(raw).proxy

// let [a, context] = createContext({ a: 1 })
