import { createProxy } from "./reactive"

export type Hooks = {
  beforeMounted?: () => void
  mounted?: () => void
}

const stateMap = new WeakMap()

export const useState = <T>(raw: T) => {
  return []
}
