import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '..'

export const suspense = directive(
  (
    wish: (() => Promise<unknown>) | Promise<unknown>,
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

    const v = wish instanceof Promise ? wish : wish()

    v.then(async (res) => {
      let temp = res
      while (temp instanceof Promise) {
        temp = await temp
      }
      part.setValue(temp)
    }).catch((e) => {
      hooks?.onCatch?.(e)
      part.setValue(fallback)
    })

    return pending
  }
)
