import { createContext } from '@gallop/gallop'

export const [menuData, menuContext] = createContext<{
  menu: { name: string; children: string[] }[]
}>({
  menu: [
    { name: 'Essentials', children: ['Overview', 'Installation'] },
    { name: 'Main-Concepts', children: ['Template', 'Component'] }
  ]
})

export const [localeData, localeContext] = createContext({
  locale: 'zh',
  list: ['zh']
})
