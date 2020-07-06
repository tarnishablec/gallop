import { Key } from '../utils'
import { directive } from '../directive'
import { Part, NodePart } from '../part'
import { DirectivePartTypeError, DuplicatedKeyError } from '../error'

type DiffKey = Key
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

function listKeyDiff(oldList: DiffKey[], newList: DiffKey[]) {
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

const partKeyCache = new WeakMap<NodePart, DiffKey[]>()

export const repeat = directive(function <T>(
  items: Iterable<T>,
  keyFn: (item: T, index: number) => DiffKey,
  mapFn: (item: T, index: number) => unknown
) {
  return (part: Part) => {
    if (!(part instanceof NodePart))
      throw DirectivePartTypeError(part.constructor.name)

    const oldKeys = partKeyCache.get(part)
    const newKeys: DiffKey[] = []
    const newVals: unknown[] = []

    let index = 0
    for (const item of items) {
      const k = keyFn(item, index)
      if (newKeys.includes(k)) throw DuplicatedKeyError(k)
      newKeys.push(k)
      newVals.push(mapFn(item, index))
      index++
    }

    const diffRes = listKeyDiff(oldKeys ?? [], newKeys)
    debugger
    // TODO
    diffRes.forEach((change) => {
      switch (change.type) {
        case 'insert':
          break
        default:
          break
      }
    })
  }
})
