import { Looper, useEffect, useHookCount } from '@gallop/gallop'

export const useOnceEffect = () => {
  const { tagName } = Looper.resolveCurrentElement()
  const count = useHookCount()
  // TODO
}
