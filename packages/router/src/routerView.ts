import {
  directive,
  Part,
  NodePart,
  DirectivePartTypeError,
  DirectiveFn
} from '@gallop/gallop'

export const routerView = directive(
  (): DirectiveFn =>
    function (part: Part) {
      if (!(part instanceof NodePart)) {
        throw DirectivePartTypeError(part.type)
      }
    }
)
