import { directive, DirectiveFn } from '../directive'
import { Part, NodePart } from '../part'

export const repeat = directive(
  (a: number): DirectiveFn => {
    return (part: Part) => {
      if (!(part instanceof NodePart)) {
        throw new Error('repeat can only be used in text bindings')
      }
      console.log('this is a directive ' + a)
      return a
    }
  }
)
