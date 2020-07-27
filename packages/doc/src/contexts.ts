import { createContext } from '@gallop/gallop'

export const menuData = {
  menu: [
    { name: 'Introduction', children: ['Overview', 'Installation'] },
    { name: 'Main-Concepts', children: ['Template', 'Component', 'Event'] },
    { name: 'Component-In-Depth' }
  ]
}

export const [localeData, localeContext] = createContext({
  locale: 'zh',
  list: ['zh']
})
