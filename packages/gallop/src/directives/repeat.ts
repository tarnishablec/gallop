import { directive, DirectiveFn, checkIsNodePart } from '../directive'
import { Part, NodePart } from '../part'
import { Primitive, handleEntry, extractDof } from '../utils'
import { DuplicatedKeyError } from '../error'
import { insertAfter, removeNodes } from '../dom'

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
      if (~newKeys.indexOf(newKey)) {
        throw DuplicatedKeyError(newKey)
      }
      newKeys.push(newKey)
      newVals.push(mapFn(item, index))
      index++
    }

    const diffRes = listKeyDiff([...oldKeys], newKeys)
    console.log(diffRes)

    const getAfterNode = (after: DiffKeyType | null) =>
      after !== null ? keyRangeMap.get(after)!.end : part.location.startNode

    diffRes.forEach((change) => {
      switch (change.type) {
        case 'insert':
          {
            const { key, after } = change
            const dof = extractDof(handleEntry(newVals[newKeys.indexOf(key)]))
            keyRangeMap.set(key, { start: dof.firstChild, end: dof.lastChild })
            insertAfter(parent, dof, getAfterNode(after))
          }
          break
        case 'movea':
          {
            const { key, after } = change
            const { start, end } = keyRangeMap.get(key)!
            const nodes = removeNodes(parent, start, end?.nextSibling)
            insertAfter(parent, nodes, getAfterNode(after))
          }
          break
        case 'moveb':
          {
            const { key, before } = change
            const { start, end } = keyRangeMap.get(key)!
            const nodes = removeNodes(parent, start, end?.nextSibling)
            parent.insertBefore(
              nodes,
              before !== null
                ? keyRangeMap.get(before)!.start!
                : part.location.endNode!
            )
          }
          break
        case 'remove':
          {
            const { key } = change
            const { start, end } = keyRangeMap.get(key)!
            removeNodes(parent, start, end?.nextSibling)
          }
          break
      }
    })

    partKeyCache.set(part, newKeys)
    return newVals
  }
},
true)

type Change =
  | {
      type: 'insert'
      key: DiffKeyType
      after: DiffKeyType | null
    }
  | {
      type: 'movea'
      key: DiffKeyType
      after: DiffKeyType | null
    }
  | {
      type: 'moveb'
      key: DiffKeyType
      before: DiffKeyType | null
    }
  | {
      type: 'remove'
      key: DiffKeyType
    }

const nulltag = Symbol('null')

export function listKeyDiff(oldList: DiffKeyType[], newList: DiffKeyType[]) {
  let oldhead = 0
  let newhead = 0
  let oldtail = oldList.length - 1
  let newtail = newList.length - 1
  let lasthead: DiffKeyType | null = null
  let lasttail: DiffKeyType | null = null
  const res: Change[] = []

  while (oldhead < oldtail && newhead < newtail) {
    if (oldList[oldhead] === nulltag) {
      oldhead++
    } else if (oldList[oldtail] === nulltag) {
      oldtail--
    } else if (newList[newhead] === oldList[oldhead]) {
      lasthead = newList[newhead]
      newhead++
      oldhead++
    } else if (newList[newhead] === oldList[oldtail]) {
      res.push({ type: 'movea', key: oldList[oldtail], after: lasthead })
      lasthead = oldList[oldtail]
      newhead++
      oldtail--
    } else if (newList[newtail] === oldList[oldtail]) {
      lasttail = oldList[oldtail]
      oldtail--
      newtail--
    } else if (newList[newtail] === oldList[oldhead]) {
      res.push({ type: 'moveb', key: oldList[oldhead], before: lasttail })
      lasttail = oldList[oldhead]
      newtail--
      oldhead++
    } else {
      const headIndex = oldList.indexOf(newList[newhead])
      if (~headIndex) {
        res.push({ type: 'movea', key: newList[newhead], after: lasthead })
        oldList[headIndex] = nulltag
      } else {
        res.push({ type: 'insert', key: newList[newhead], after: lasthead })
      }
      lasthead = newList[newhead]
      newhead++

      if (!~newList.indexOf(oldList[oldtail])) {
        res.push({ type: 'remove', key: oldList[oldtail] })
        oldtail--
      }
    }
  }
  if (newhead < newtail) {
    for (; newhead <= newtail; newhead++) {
      if (!~oldList.indexOf(newList[newhead])) {
        res.push({ type: 'insert', key: newList[newhead], after: lasthead })
      }
      lasthead = newList[newhead]
    }
  }
  if (oldhead < oldtail) {
    for (; oldhead <= oldtail; oldhead++) {
      if (oldList[oldhead] !== nulltag) {
        if (!~newList.indexOf(oldList[oldhead])) {
          res.push({ type: 'remove', key: oldList[oldhead] })
        }
      }
    }
  }
  return res
}
