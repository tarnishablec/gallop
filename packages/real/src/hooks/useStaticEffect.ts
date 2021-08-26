import { Looper, useEffect, useHookCount } from '@gallop/gallop'

export const useStaticEffect = () => {
  const { tagName } = Looper.resolveCurrentElement()
  const count = useHookCount()
  // TODO
}
