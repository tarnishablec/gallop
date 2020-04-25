import { directive, DirectiveFn, checkIsNodePart } from '../directive'
import { Part, NodePart } from '../part'
import { Primitive, tryParseToString } from '../utils'
import { DuplicatedKeyError } from '../error'
import { HTMLClip, createInstance, getVals } from '../clip'
import { VirtualElement } from '../component'

export type DiffKeyType = Exclude<Primitive, null | undefined | boolean>

const partKeyCache = new WeakMap<NodePart, DiffKeyType[]>()
const partKeyRangeCache = new WeakMap<
  NodePart,
  Map<DiffKeyType, { start: Node | null; end: Node | null }>
>()

export const repeat = directive(function <T>(
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

    diffRes.forEach((change) => {})

    partKeyCache.set(part, newKeys)
    return newVals
  }
},
true)

export function handleEntry(val: unknown) {
  const dof = new DocumentFragment()
  if (Array.isArray(val)) {
    val.forEach((v) => {
      dof.append(handleEntry(v))
    })
  } else if (val instanceof HTMLClip) {
    const clip = val.do(createInstance)
    clip.tryUpdate(val.do(getVals))
    dof.append(clip.dof)
  } else if (val instanceof VirtualElement) {
    dof.append(val.createInstance())
  } else {
    dof.append(tryParseToString(val))
  }
  return dof
}

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
  const res: Change[] = []
  let lastOldIndex: undefined | number = undefined
  let lastNewIndex: undefined | number = undefined
  let lastNewKey: DiffKeyType | null = null
  let buffer: Change[] = []

  newList.forEach((item, i) => {
    const j = oldList.indexOf(item)
    if (j < 0) {
      buffer.push({ type: 'insert', after: lastNewKey })
    } else {
    }
  })

  return []
}
