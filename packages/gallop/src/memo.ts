import { Key } from './utils'
import { dirtyMap } from './reactive'

export class Memo<T extends () => any = () => void> {
  watchList: Set<[Object, Key]> = new Set()
  value: ReturnType<T>
  static currentMemo: Memo | undefined = undefined

  constructor(public calc?: T) {
    Memo.currentMemo = this
    this.value = calc?.()
    calc && (Memo.currentMemo = undefined)
  }

  static stop() {
    Memo.currentMemo = undefined
  }

  static resolveCurrentMemo() {
    return Memo.currentMemo
  }

  watch(target: Object, prop: Key) {
    this.watchList.add([target, prop])
  }
}

export const checkMemoDirty = (memo: Memo): boolean => {
  for (const [obj, key] of memo.watchList) {
    if (dirtyMap.get(obj)?.has(key)) {
      return true
    }
  }
  return false
}
