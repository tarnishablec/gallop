import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '..'

export const suspense = directive(
  (
    wish: Promise<unknown>,
    fallback?: unknown,
    hooks?: {
      onFinally?: () => void
      onThen?: (res: unknown) => void
      onCatch?: (err: Error) => void
    }
  ) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }
    wish
      .then(async (res) => {
        let pendingVal = res
        // debugger
        while (pendingVal instanceof Promise) {
          pendingVal = await res
        }
        part.setValue(pendingVal)
        hooks?.onThen?.(pendingVal)
      })
      .catch(hooks?.onCatch)
      .finally(hooks?.onFinally)
    return fallback ?? null
  }
)
