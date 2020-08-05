import { NodePart } from '../part'
import { directive, ensurePartType } from '../directive'

export type SuspenseOption = {
  pending?: () => unknown
  fallback?: () => unknown
  once?: boolean
  delay?: number
}

const onceSet = new WeakSet<NodePart>()

export const suspense = directive(function <T>(
  wish: () => Promise<T>,
  { pending, fallback, once = true, delay = 0 }: SuspenseOption = {}
) {
  return (part) => {
    if (!ensurePartType(part, NodePart)) return
    if (once && pending !== void 0 && !onceSet.has(part)) {
      part.setValue(pending())
      onceSet.add(part)
    } else {
      part.setValue(pending?.())
    }
    wish()
      .then((res) => setTimeout(() => part.setValue(res), delay))
      .catch(() => {
        fallback !== undefined && part.setValue(fallback())
        onceSet.delete(part)
      })
  }
})
