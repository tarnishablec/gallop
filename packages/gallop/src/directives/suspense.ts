import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'

type SuspenseOption = {
  pending: unknown
  fallback?: unknown
  maxDuration?: unknown
  virtualLoad?: unknown
}

export const suspense = directive(function <T>(
  wish: () => Promise<T>,
  {
    pending,
    fallback = null,
    maxDuration = 1500,
    virtualLoad = 200
  }: SuspenseOption
) {
  console.log(pending, fallback, maxDuration, virtualLoad)

  return (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }
    console.log('in')
    wish().then((res) => {
      part.setValue(res)
    })
    return pending
  }
})
