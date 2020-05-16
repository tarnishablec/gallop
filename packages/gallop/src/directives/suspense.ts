import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError } from '../error'
import { shallowEqual } from '../utils'
// import { Memo, checkMemoDirty } from '../memo'

const empty = Symbol('empty')

const renderCache = new WeakMap<NodePart, unknown>()
// const memosCache = new WeakMap<NodePart, Memo<any>>()

const dependsCache = new Map<NodePart, unknown[]>()

export const suspense = directive(
  (
    wish: () => Promise<unknown>,
    pending: unknown = null,
    fallback: unknown = null,
    depends: unknown[] = [],
    hooks?: {
      onFinally?: () => void
      onThen?: (res: unknown) => void
      onCatch?: (err: Error) => void
    },
    maxDuration: number = 1500,
    virtualLoading: number = 300
  ) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }
  }
)
