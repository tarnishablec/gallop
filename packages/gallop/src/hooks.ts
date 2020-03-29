import { resolveCurrentHandle } from './component'
import { createProxy } from './reactive'

export function useState<T extends object>(initState: T): [T] {
  const current = resolveCurrentHandle()
  return current.$state
    ? ([current.$state] as [T])
    : [(current.$state = createProxy(initState, () => current.enUpdateQueue()))]
}
