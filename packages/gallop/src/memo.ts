import { Key } from './utils'

let currentMemo: Memo | undefined = undefined

export const resolveCurrentMemo = () => currentMemo

export class Memo {
  watchList: Set<[Object, Key]> = new Set()
  value: unknown

  constructor(public calc: Function) {
    currentMemo = this
    this.value = calc()
    currentMemo = undefined
  }

  watch(target: Object, prop: Key) {
    this.watchList.add([target, prop])
  }
}
