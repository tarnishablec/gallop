import { directive, DirectiveFn, checkIsNodePart } from '../directive'
import { Part, NodePart } from '../part'
import { Primitive, keyListDiff } from '../utils'
import { DuplicatedKeyError } from '../error'
import { HTMLClip, createInstance, getVals } from '../clip'
import { VirtualElement } from '../component'

type KeyType = Exclude<Primitive, null | undefined | boolean>

const PartKeyCache = new WeakMap<NodePart, Primitive[]>()

export const repeat = directive(function <T>(
  items: Iterable<T>,
  keyFn: (item: T, index: number) => KeyType,
  mapFn: (item: T, index: number) => unknown
): DirectiveFn {
  return (part: Part) => {
    checkIsNodePart(part)

    const newKeys: Primitive[] = []
    const newValues: unknown[] = []
    const keyRangeMap = new Map<KeyType, Range>()

    const oldKeys = PartKeyCache.get(part as NodePart) ?? []

    let index = 0
    for (const item of items) {
      const newKey = keyFn(item, index)
      if (newKeys.indexOf(newKey) >= 0) {
        throw DuplicatedKeyError(newKey)
      } else {
        newKeys.push(newKey)
      }

      newValues.push(mapFn(item, index))
      index++
    }

    const diffRes = keyListDiff(oldKeys, newKeys)

    console.log(diffRes)
    console.log(newKeys)
    console.log(newValues)

    diffRes.forEach((change) => {
      switch (change.type) {
        case 'insert':
          if (!change.after) {
          } else {
            const val = newValues[change.newIndex]
          }
          break
        case 'move':
          break
        case 'remove':
          break
      }
    })

    PartKeyCache.set(part as NodePart, newKeys)
    return newValues
  }
},
true)

function handleEntry(val: unknown) {
  if (val instanceof HTMLClip) {
    const clip = val.do(createInstance)
    clip.tryUpdate(val.do(getVals))
    return clip.dof
  } else if (val instanceof VirtualElement) {
    return val.createInstance()
  } else {
    //TODO
  }
}
