import { ArrayPart, type DiffKey, listKeyDiff } from '@gallop/gallop/directives'
import {
  directive,
  DuplicatedKeyError,
  ensurePartType,
  NodePart,
  forceGet
} from '@gallop/gallop'

export class SharedArrayPart extends ArrayPart {
  static partCache = new Map<DiffKey, NodePart>()

  override remove(key: DiffKey) {
    SharedArrayPart.partCache.set(key, this.keyPartMap.get(key)!)
    // TODO 内存泄漏风险
    setTimeout(() => {
      SharedArrayPart.partCache.delete(key)
    }, 1000)
    this.keyPartMap.delete(key)
  }

  override createPartAfter(key: DiffKey, after: DiffKey) {
    const end = this.keyPartMap.get(after)?.location.endNode
    const part =
      SharedArrayPart.partCache.get(key) ?? NodePart.create(String(key))
    const start = this.location.startNode
    part.moveInto(
      this.location.endNode.parentNode!,
      end?.nextSibling ?? start.nextSibling
    )
    this.keyPartMap.set(key, part)
  }
}

const arrPartMap = new WeakMap<NodePart, SharedArrayPart>()

export const sharedRepeat = directive(
  <T>(
      items: Iterable<T>,
      keyFn: (item: T, index: number) => DiffKey,
      mapFn: (item: T, index: number) => unknown
    ) =>
    (part) => {
      if (!ensurePartType(part, NodePart)) return

      const arrPart = forceGet(
        arrPartMap,
        part,
        () => new SharedArrayPart(part.location)
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
)
