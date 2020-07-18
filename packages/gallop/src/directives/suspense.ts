import { NodePart } from '../part'
import { directive } from '../directive'
import { DirectivePartTypeError } from '../error'

type SuspenseOption = {
  pending?: unknown
  fallback?: unknown
  once?: boolean
  delay?: number
}

const onceSet = new WeakSet<NodePart>()

export const suspense = directive(function <T>(
  wish: () => Promise<T>,
  { pending = null, fallback = null, once = true, delay = 0 }: SuspenseOption = {}
) {
  return (part) => {
    if (!(part instanceof NodePart))
      throw DirectivePartTypeError(part.constructor.name)

    if (once) {
      if (!onceSet.has(part)) {
        part.setValue(pending)
        onceSet.add(part)
      }
    } else {
      part.setValue(pending)
    }
    wish()
      .then((res) => {
        setTimeout(() => {
          part.setValue(res)
        }, delay)
      })
      .catch(() => {
        part.setValue(fallback)
        onceSet.delete(part)
      })
  }
})
