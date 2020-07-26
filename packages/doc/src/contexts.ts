import { createContext } from '@gallop/gallop'

export const [menuData, menuContext] = createContext<{
  menu: { name: string; children: string[] }[]
  current: string
  dead: boolean
}>({
  menu: [
    { name: 'Essentials', children: ['Overview', 'Installation'] },
    { name: 'Main-Concepts', children: ['Template', 'Component'] }
  ],
  current: 'Essentials',
  dead: false
})

export const [localeData, localeContext] = createContext({
  locale: 'zh',
  list: ['zh']
})
