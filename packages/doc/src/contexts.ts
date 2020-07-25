import { createContext } from '@gallop/gallop'

export const [{ menu }, menuContext] = createContext<{
  menu: { name: string; children: string[] }[]
}>({
  menu: [
    { name: 'Essentials', children: ['Overview', 'Installation'] },
    { name: 'Main-Concepts', children: ['Template'] }
  ]
})

export const [localeData, localeContext] = createContext({
  locale: 'zh',
  list: ['zh']
})
