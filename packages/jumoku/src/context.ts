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
      let elementInstance = clip.elementInstance!
      elementInstance.enupdateQueue()
    })
  }
}

export const createContext = <T extends object>(raw: T) =>
  new Context(raw).proxy
