import { NodePart } from '../part'
import { directive } from '../directive'
import { DirectivePartTypeError } from '../error'

type SuspenseOption = {
  pending?: unknown
  fallback?: unknown
  once?: boolean
}

const onceSet = new WeakSet<NodePart>()

export const suspense = directive(function <T>(
  wish: () => Promise<T>,
  { pending = null, fallback = null, once = true }: SuspenseOption = {}
) {
  return (part) => {
    if (!(part instanceof NodePart))
      throw DirectivePartTypeError(part.constructor.name)

    setTimeout(() => {
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
          part.setValue(res)
        })
        .catch(() => {
          part.setValue(fallback)
          onceSet.delete(part)
        })
    }, 0)
  }
})
