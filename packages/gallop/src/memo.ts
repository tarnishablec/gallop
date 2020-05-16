import { Key } from './utils'
import { dirtyMap } from './reactive'

let currentMemo: Memo<() => any> | undefined = undefined

export const resolveCurrentMemo = () => currentMemo

export class Memo<T extends () => any> {
  watchList: Set<[Object, Key]> = new Set()
  value: ReturnType<T>

  constructor(public calc?: T) {
    currentMemo = this
    this.value = calc?.()
    calc && (currentMemo = undefined)
  }

  static stop() {
    currentMemo = undefined
  }

  watch(target: Object, prop: Key) {
    this.watchList.add([target, prop])
  }
}

export const checkMemoDirty = (memo: Memo<any>): boolean => {
  for (const [obj, key] of memo.watchList) {
    if (dirtyMap.get(obj)?.has(key)) {
      return true
    }
  }
  return false
}
