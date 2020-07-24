import { createContext } from '@gallop/gallop'

export const [{ menu }, menuContext] = createContext({
  menu: [{ name: 'Essentials', children: ['Overview', 'Installation'] }]
})

export const [localeData, localeContext] = createContext({
  locale: 'e',
  list: ['zh']
})
