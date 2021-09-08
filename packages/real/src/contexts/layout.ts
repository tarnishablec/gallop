import { createContext } from '@gallop/gallop'
import { SerializedWidget } from '@real/interface'

export const layoutContext = createContext<{
  layout: SerializedWidget[]
  widgets: SerializedWidget[]
}>({ layout: [], widgets: [] })
