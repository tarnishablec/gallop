import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'

// const partValueMap = new WeakMap<NodePart, unknown>()

type SuspenseOption = {
  pending?: unknown
  fallback?: unknown
  // maxDuration?: number
  virtualLoad?: number
  keepalive?: boolean
}

export const suspense = directive(function <T>(
  wish: () => Promise<T>,
  {
    pending,
    fallback = null,
    // maxDuration = 1500,
    virtualLoad
  }: SuspenseOption = {}
) {
  // console.log(pending, fallback, maxDuration, virtualLoad)

  return (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

    setTimeout(() => {
      part.setValue(pending)
    }, 0)

    setTimeout(() => {
      wish()
        .then((res) => {
          console.log(part.value)
          part.setValue(res)
        })
        .catch(() => {
          part.setValue(fallback)
        })
        .finally(() => {})
    }, virtualLoad)
  }
}, true)
