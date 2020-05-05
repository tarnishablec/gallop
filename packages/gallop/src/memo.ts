import { Key } from './utils'

let currentMemo: Memo<() => any> | undefined = undefined

export const resolveCurrentMemo = () => currentMemo

export class Memo<T extends () => any> {
  watchList: Set<[Object, Key]> = new Set()
  value: ReturnType<T>

  constructor(public calc: T) {
    currentMemo = this
    this.value = calc()
    currentMemo = undefined
  }

  watch(target: Object, prop: Key) {
    this.watchList.add([target, prop])
  }
}
