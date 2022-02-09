import {
  directive,
  ensurePartType,
  checkDependsDirty,
  NodePart
} from '@gallop/gallop'

export type SuspenseOption = {
  pending?: () => unknown
  fallback?: () => unknown
  once?: boolean
  delay?: number
  depends?: unknown[]
}

const onceSet = new WeakSet<NodePart>()

export const suspense = directive(function <T>(
  wish: () => Promise<T>,
  { pending, fallback, once = true, delay = 0, depends }: SuspenseOption = {}
) {
  return (part) => {
    if (!ensurePartType(part, NodePart)) return

    if (!checkDependsDirty(part, depends)) return

    pending !== void 0 &&
      (!once || (once && !onceSet.has(part))) &&
      part.setValue(pending())
    wish()
      .then((res) =>
        setTimeout(() => {
          part.setValue(res)
          onceSet.add(part)
        }, delay)
      )
      .catch(() => part.setValue(fallback?.()))
  }
})
