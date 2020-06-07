// /* eslint-disable @typescript-eslint/no-unused-vars */
import {
  directive,
  Part,
  NodePart,
  DirectivePartTypeError
} from '@gallop/gallop'

// import { Router, Route } from '@gallop/router'
// import { match, parse, compile } from 'path-to-regexp'

const partMap = new Map<Part, unknown>()

export const routerView = directive(
  <T extends object>({ props }: { props?: T } = {}) =>
    function (part: Part) {
      if (!(part instanceof NodePart)) {
        throw DirectivePartTypeError(part.type)
      }
    }
)
