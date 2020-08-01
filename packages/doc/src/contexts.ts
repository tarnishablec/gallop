import { createContext } from '@gallop/gallop'
import type json from '@doc/language/zh.json'

type Name = keyof typeof json

export const menuData: { menu: { name: Name; children?: Name[] }[] } = {
  menu: [
    {
      name: 'Introduction',
      children: ['Overview', 'Installation', 'No-Silver-Bullet']
    },
    {
      name: 'Main-Concepts',
      children: [
        'Template',
        'Component',
        'Event',
        'Style',
        'Hooks',
        'Directives',
        'Context'
      ]
    },
    { name: 'Component-In-Depth' }
  ]
}

export const [localeData, localeContext] = createContext({
  locale: 'zh',
  list: ['zh']
})
