import { Looper, ReactiveElement, useHookCount } from '@gallop/gallop'

const raceMap = new WeakMap<ReactiveElement['$builder'], number[]>()
export const useStaticEffect = (effect: () => unknown) => {
  const current = Looper.resolveCurrentElement()
  const count = useHookCount()
  const counts = raceMap.get(current.$builder)
  let has: boolean
  if (!counts) {
    has = false
    raceMap.set(current.$builder, [count])
  } else if (!counts.includes(count)) {
    has = false
    counts.push(count)
  } else {
    has = true
  }
  !has && setTimeout(() => effect(), 0)
}
