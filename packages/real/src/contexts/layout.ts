import { createContext } from '@gallop/gallop'
import { IBlock, IPanel } from '@real/interface'

export const layoutContext = createContext<{
  layout: (IPanel | IBlock)[]
  items: (IPanel | IBlock)[]
}>({ layout: [], items: [] })
