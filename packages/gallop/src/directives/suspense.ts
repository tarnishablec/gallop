import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'

// const partValueMap = new WeakMap<NodePart, unknown>()

const onceSet = new WeakSet<NodePart>()

type SuspenseOption = {
  pending?: unknown
  fallback?: unknown
  once?: boolean
}

export const suspense = directive(function <T>(
  wish: () => Promise<T>,
  { pending = null, fallback = null, once = true }: SuspenseOption = {}
) {
  return (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

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
        .finally(() => {})
    }, 0)
  }
},
true)
