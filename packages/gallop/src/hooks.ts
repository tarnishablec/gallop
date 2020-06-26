import { Obj } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'

export function useState<T extends Obj>(raw: T): [T] {
  const current = Looper.resolveCurrent()
  return [
    current.$state
      ? (current.$state as T)
      : (current.$state = createProxy(raw, {
          onSet: () => current.requestUpdate()
        }))
  ]
}
