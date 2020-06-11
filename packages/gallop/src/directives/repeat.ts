import { directive, DirectiveFn, resolveDirective } from '../directive'
import {
  Part,
  NodePart,
  extractDof,
  initEntry,
  NodeValueType,
  tryUpdateEntry
} from '../part'
import { Key } from '../utils'
import { DuplicatedKeyError, DirectivePartTypeError } from '../error'
import { insertAfter, removeNodes } from '../dom'

export type DiffKey = Key

const partKeyCache = new WeakMap<NodePart, DiffKey[]>()
const partKeyRangeCache = new WeakMap<
  NodePart,
  Map<DiffKey, { start: Node | null; end: Node | null; val: NodeValueType }>
>()

export const repeat = directive(function <T>(
  items: Iterable<T>,
  keyFn: (item: T, index: number) => DiffKey,
  mapFn: (item: T, index: number) => unknown
): DirectiveFn {
  return (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw DirectivePartTypeError(part.type)
    }

    const { startNode } = part.location
    const parent = startNode.parentNode!

    const newKeys: DiffKey[] = []
    const newVals: unknown[] = []
    const keyRangeMap =
      partKeyRangeCache.get(part) ??
      partKeyRangeCache.set(part, new Map()).get(part)!

    const oldKeys = partKeyCache.get(part) ?? []
    let index = 0
    for (const item of items) {
      const newKey = keyFn(item, index)
      if (newKeys.includes(newKey)) {
        throw DuplicatedKeyError(newKey)
      }
      newKeys.push(newKey)
      newVals.push(mapFn(item, index))
      index++
    }

    const diffRes = listKeyDiff([...oldKeys], newKeys)
    // console.log(diffRes)

    oldKeys
      .filter((k) => !diffRes.map((v) => v.key).includes(k))
      .forEach((key) => {
        const { start, end, val } = keyRangeMap.get(key)!
        const [pendingVal] = resolveDirective(
          newVals[newKeys.indexOf(key)],
          part
        )
        const [v, isInit] = tryUpdateEntry(val, pendingVal)
        keyRangeMap.set(key, { start, end, val: v })
        if (isInit) {
          parent.insertBefore(extractDof(v), start)
          removeNodes(parent, start, end!.nextSibling)
        }
      })

    const getAfterNode = (after: DiffKey | null) =>
      after !== null ? keyRangeMap.get(after)!.end : part.location.startNode

    diffRes.forEach((change) => {
      switch (change.type) {
        case 'insert':
          {
            const { key, after } = change
            const [pendingVal] = resolveDirective(
              newVals[newKeys.indexOf(key)],
              part
            )

            const val = initEntry(pendingVal)
            const dof = extractDof(val)
            keyRangeMap.set(key, {
              start: dof.firstChild,
              end: dof.lastChild,
              val
            })
            insertAfter(parent, dof, getAfterNode(after))
          }
          break
        case 'movea':
        case 'moveb':
          {
            const { key } = change
            const { start, end, val } = keyRangeMap.get(key)!
            const [pendingVal] = resolveDirective(
              newVals[newKeys.indexOf(key)],
              part
            )

            const [v, isInit] = tryUpdateEntry(val, pendingVal)
            let nodes: DocumentFragment = removeNodes(
              parent,
              start,
              end!.nextSibling
            )
            if (isInit) {
              nodes = extractDof(v)
            }
            keyRangeMap.set(key, {
              start: nodes.firstChild,
              end: nodes.lastChild,
              val: v
            })
            if (change.type === 'moveb') {
              const before = change.before
              parent.insertBefore(
                isInit ? extractDof(v) : nodes,
                before !== null
                  ? keyRangeMap.get(before)!.start!
                  : part.location.endNode!
              )
            } else {
              insertAfter(
                parent,
                isInit ? extractDof(v) : nodes,
                getAfterNode(change.after)
              )
            }
          }
          break
        case 'remove':
          {
            const { key } = change
            const { start, end } = keyRangeMap.get(key)!
            removeNodes(parent, start, end!.nextSibling)
          }
          break
      }
    })

    partKeyCache.set(part, newKeys)
    Reflect.set(part, 'value', newVals)
  }
},
true)

type Change =
  | {
      type: 'insert'
      key: DiffKey
      after: DiffKey | null
    }
  | {
      type: 'movea'
      key: DiffKey
      after: DiffKey | null
    }
  | {
      type: 'moveb'
      key: DiffKey
      before: DiffKey | null
    }
  | {
      type: 'remove'
      key: DiffKey
    }

const nulltag = Symbol('null')

export function listKeyDiff(oldList: DiffKey[], newList: DiffKey[]) {
  let oldhead = 0
  let newhead = 0
  let oldtail = oldList.length - 1
  let newtail = newList.length - 1
  let lasthead: DiffKey | null = null
  let lasttail: DiffKey | null = null
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

      if (!newList.includes(oldList[oldtail])) {
        res.push({ type: 'remove', key: oldList[oldtail] })
        oldtail--
      }
    }
  }
  if (newhead < newtail || newhead > oldtail) {
    for (; newhead <= newtail; newhead++) {
      if (!oldList.includes(newList[newhead])) {
        res.push({ type: 'insert', key: newList[newhead], after: lasthead })
      }
      lasthead = newList[newhead]
    }
  }
  if (oldhead < oldtail || oldhead > newtail) {
    for (; oldhead <= oldtail; oldhead++) {
      if (oldList[oldhead] !== nulltag) {
        if (!newList.includes(oldList[oldhead])) {
          res.push({ type: 'remove', key: oldList[oldhead] })
        }
      }
    }
  }
  return res
}
