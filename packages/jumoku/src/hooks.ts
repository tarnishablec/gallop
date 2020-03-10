import { createProxy } from './reactive'

export const useState = <T extends object>(initValue: T) => [
  createProxy(initValue)
]
export const useEffect = () => {}
export const useContext = () => {}
