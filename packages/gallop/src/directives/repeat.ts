import { directive, DirectiveFn, checkIsNodePart } from '../directive'
import { Part, NodePart } from '../part'
import { Primitive } from '../utils'
import { DuplicatedKeyError } from '../error'

export type DiffKeyType = Exclude<Primitive, null | undefined | boolean>

const partKeyCache = new WeakMap<NodePart, DiffKeyType[]>()
const partKeyRangeCache = new WeakMap<
  NodePart,
  Map<DiffKeyType, { start: Node | null; end: Node | null }>
>()

export const repeat = directive(function<T>(
  items: Iterable<T>,
  keyFn: (item: T, index: number) => DiffKeyType,
  mapFn: (item: T, index: number) => unknown
): DirectiveFn {
  return (part: Part) => {
    if (!checkIsNodePart(part)) {
      return
    }

    const { startNode } = part.location
    const parent = startNode.parentNode!

    const newKeys: DiffKeyType[] = []
    const newVals: unknown[] = []
    const keyRangeMap =
      partKeyRangeCache.get(part) ??
      partKeyRangeCache.set(part, new Map()).get(part)!

    const oldKeys = partKeyCache.get(part) ?? []

    let index = 0
    for (const item of items) {
      const newKey = keyFn(item, index)
      if (newKeys.indexOf(newKey) >= 0) {
        throw DuplicatedKeyError(newKey)
      } else {
        newKeys.push(newKey)
      }

      newVals.push(mapFn(item, index))
      index++
    }

    const diffRes = listKeyDiff(oldKeys, newKeys)

    console.log(diffRes)
    console.log(newKeys)
    console.log(newVals)

    diffRes.forEach(change => {})

    partKeyCache.set(part, newKeys)
    return newVals
  }
},
false)

type Change =
  | {
      type: 'insert'
      after: DiffKeyType | null
    }
  | {
      type: 'move'
      oldIndex: number
      after: DiffKeyType | null
    }
  | {
      type: 'remove'
      oldIndex: number
    }

function listKeyDiff(oldList: DiffKeyType[], newList: DiffKeyType[]): Change[] {
  const buffer: Change[] = []
  let nextKey: DiffKeyType

  newList.forEach((n, i) => {
    const j = oldList.indexOf(n)
    nextKey = newList[i + 1]
    const nextj = oldList.indexOf(nextKey)
  })
  return []
}
