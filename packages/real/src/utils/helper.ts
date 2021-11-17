import type { Class } from './type'

export function classOf<T extends object>(instance: T) {
  return instance.constructor as Class<T>
}
