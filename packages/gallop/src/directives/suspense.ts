import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'

// const partValueMap = new WeakMap<NodePart, unknown>()

type SuspenseOption = {
  pending?: unknown
  fallback?: unknown
  keepalive?: boolean
}

export const suspense = directive(function <T>(
  wish: () => Promise<T>,
  { pending, fallback = null }: SuspenseOption = {}
) {
  return (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

    setTimeout(() => {
      part.setValue(pending)
      wish()
        .then((res) => {
          part.setValue(res)
        })
        .catch(() => {
          part.setValue(fallback)
        })
        .finally(() => {})
    }, 0)
  }
},
true)
