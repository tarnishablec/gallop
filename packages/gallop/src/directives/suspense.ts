import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '..'

export const suspense = directive(
  (
    wish: Promise<unknown>,
    pending: unknown = null,
    fallback: unknown = null,
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
        let temp = res
        // debugger
        while (temp instanceof Promise) {
          temp = await res
        }
        part.setValue(temp)
        hooks?.onThen?.(temp)
      })
      .catch((error) => {
        hooks?.onCatch?.(error)
        part.setValue(fallback)
      })
      .finally(hooks?.onFinally)
    return pending
  }
)
