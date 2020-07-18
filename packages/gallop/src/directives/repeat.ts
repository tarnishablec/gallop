import { Key, forceGet } from '../utils'
import { directive } from '../directive'
import { NodePart } from '../part'
import { DirectivePartTypeError, DuplicatedKeyError } from '../error'
import { removeNodes, insertAfter } from '../dom'

type DiffKey = Key | null
type Change =
  | {
      type: 'insert'
      key: DiffKey
      after: DiffKey
    }
  | {
      type: 'movea' // move after
      key: DiffKey
      after: DiffKey
    }
  | {
      type: 'moveb' // move before
      key: DiffKey
      before: DiffKey
    }
  | {
      type: 'remove'
      key: DiffKey
    }

const nul = Symbol(0)

export function listKeyDiff(oldList: DiffKey[], newList: DiffKey[]) {
  let oldHead = 0
  let newHead = 0
  let oldTail = oldList.length - 1
  let newTail = newList.length - 1
  let lastHead: DiffKey | null = null
  let lastTail: DiffKey | null = null
  const res: Change[] = []

  while (oldHead < oldTail && newHead < newTail) {
    if (oldList[oldHead] === nul) {
      oldHead++
    } else if (oldList[oldTail] === nul) {
      oldTail--
    } else if (newList[newHead] === oldList[oldHead]) {
      lastHead = newList[newHead]
      newHead++
      oldHead++
    } else if (newList[newHead] === oldList[oldTail]) {
      res.push({ type: 'movea', key: oldList[oldTail], after: lastHead })
      lastHead = oldList[oldTail]
      newHead++
      oldTail--
    } else if (newList[newTail] === oldList[oldTail]) {
      lastTail = oldList[oldTail]
      oldTail--
      newTail--
    } else if (newList[newTail] === oldList[oldHead]) {
      res.push({ type: 'moveb', key: oldList[oldHead], before: lastTail })
      lastTail = oldList[oldHead]
      newTail--
      oldHead++
    } else {
      const headIndex = oldList.indexOf(newList[newHead])
      if (~headIndex) {
        res.push({ type: 'movea', key: newList[newHead], after: lastHead })
        oldList[headIndex] = nul
      } else {
        res.push({ type: 'insert', key: newList[newHead], after: lastHead })
      }
      lastHead = newList[newHead]
      newHead++

      if (!newList.includes(oldList[oldTail])) {
        res.push({ type: 'remove', key: oldList[oldTail] })
        oldTail--
      }
    }
  }
  if (newHead < newTail || newHead > oldTail) {
    for (; newHead <= newTail; newHead++) {
      if (!oldList.includes(newList[newHead])) {
        res.push({ type: 'insert', key: newList[newHead], after: lastHead })
      }
      lastHead = newList[newHead]
    }
  }
  if (oldHead < oldTail || oldHead > newTail) {
    for (; oldHead <= oldTail; oldHead++) {
      if (oldList[oldHead] !== nul) {
        if (!newList.includes(oldList[oldHead])) {
          res.push({ type: 'remove', key: oldList[oldHead] })
        }
      }
    }
  }
  return res
}

class ArrayPart extends NodePart {
  keyPartMap = new Map<DiffKey, NodePart>()
  keys: DiffKey[] = []

  createPartAfter(key: DiffKey, after: DiffKey) {
    const [startNode, endNode] = [new Comment(String(key)), new Comment(String(key))]
    const parent = this.location.endNode.parentNode!
    if (after !== null) {
      const end = this.keyPartMap.get(after)?.location.endNode
      insertAfter(parent, startNode, end)
      insertAfter(parent, endNode, startNode)
    } else {
      insertAfter(parent, startNode, this.location.startNode)
      insertAfter(parent, endNode, startNode)
    }
    const part = new NodePart({ startNode, endNode })
    this.keyPartMap.set(key, part)
  }

  moveBefore(part: NodePart, before: DiffKey) {
    const { startNode, endNode } = part.location
    const nodes = removeNodes(startNode, endNode, true)
    const { startNode: start } = this.keyPartMap.get(before)!.location
    start.parentNode!.insertBefore(nodes, startNode)
  }

  moveAfter(part: NodePart, after: DiffKey) {
    const { startNode, endNode } = part.location
    const nodes = removeNodes(startNode, endNode, true)
    if (after !== null) {
      const { endNode: end } = this.keyPartMap.get(after)!.location
      insertAfter(end.parentNode!, nodes, end)
    } else {
      const parent = this.location.startNode.parentNode!
      insertAfter(parent, nodes, this.location.startNode)
    }
  }

  remove(key: DiffKey) {
    this.keyPartMap.get(key)!.destroy()
    this.keyPartMap.delete(key)
  }

  update(keys: DiffKey[], vals: unknown[]) {
    this.keys = keys
    this.keys.forEach((k, index) => this.keyPartMap.get(k)!.setValue(vals[index]))
  }
}

const arrPartMap = new WeakMap<NodePart, ArrayPart>()

export const repeat = directive(function <T>(
  items: Iterable<T>,
  keyFn: (item: T, index: number) => DiffKey,
  mapFn: (item: T, index: number) => unknown
) {
  return (part) => {
    if (!(part instanceof NodePart))
      throw DirectivePartTypeError(part.constructor.name)

    const arrPart = forceGet(
      arrPartMap,
      part,
      () => new ArrayPart({ ...part.location })
    )
    const arrPartKeyPartMap = arrPart.keyPartMap
    const oldKeys = arrPart.keys

    const newKeys: DiffKey[] = []
    const newVals: unknown[] = []

    let index = 0
    for (const item of items) {
      const k = keyFn(item, index)
      if (newKeys.includes(k)) throw DuplicatedKeyError(k)
      if (k === null) throw new SyntaxError(`key can not be null`)
      newKeys.push(k)
      const v = mapFn(item, index)
      newVals.push(v)
      index++
    }

    const diffRes = listKeyDiff(oldKeys, newKeys)

    diffRes.forEach((change) => {
      const { key } = change
      switch (change.type) {
        case 'insert':
          arrPart.createPartAfter(key, change.after)
          break
        case 'movea':
          arrPart.moveAfter(arrPartKeyPartMap.get(key)!, change.after)
          break
        case 'moveb':
          arrPart.moveBefore(arrPartKeyPartMap.get(key)!, change.before)
          break
        case 'remove':
          arrPart.remove(key)
          break
      }
    })
    arrPart.update(newKeys, newVals)
  }
})
